import os

import numpy as np
import pandas as pd
import tensorflow as tf
from matplotlib import pyplot as plt

# displays full numbers in dataframes instead of scientific notation for clarity
pd.set_option('float_format', '{:f}'.format)
pd.set_option('display.max_columns', 500)
# Show all columns
pd.set_option('display.max_columns', None)
# Show all lines
pd.set_option('display.max_rows', None)
# value display length is 100, the default is 50
pd.set_option('max_colwidth', 100)


def createModel():
    ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
    ROOT_DIR = ROOT_DIR + r"\PredictionFiles"

    pickledir = ROOT_DIR + r'\data\formattedDataPickle.pkl'
    d = pd.read_pickle(pickledir)

    copy_for_plot = d.copy()

    date_time = pd.to_datetime(d.pop("datetime_mid"))

    n = len(d)
    train_df = d[0:int(n * 0.7)]  # 70%
    val_df = d[int(n * 0.7): int(n * 0.9)]  # 20%
    test_df = d[int(n * 0.9):]  # 10%

    num_features = d.shape[1]

    # NORMALIZATION
    train_mean = train_df.mean()
    train_std = train_df.std()

    # # Store mean and std to denormalize data in make prediction
    # # storage path is Prediction --> PredictionFiles
    # ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
    # ROOT_DIR = ROOT_DIR + "\PredictionFiles"

    # train_mean_filepath = ROOT_DIR + r"\train_mean"
    # train_std_filepath = ROOT_DIR + r"\train_std"

    train_df = (train_df - train_mean) / train_std
    val_df = (val_df - train_mean) / train_std
    test_df = (test_df - train_mean) / train_std

    # Window of consecutive samples of data.
    # Contains Width, number of time steps of input and label windows
    # Time offset between steps
    # Features are used as inputs, labels or both

    class WindowGenerator():
        def __init__(self, input_width, label_width, shift,
                     train_df=train_df, val_df=val_df, test_df=test_df,
                     label_columns=None):
            # Store the raw data.
            self.train_df = train_df
            self.val_df = val_df
            self.test_df = test_df

            # Work out the label column indices.
            self.label_columns = label_columns
            if label_columns is not None:
                self.label_columns_indices = {name: i for i, name in
                                              enumerate(label_columns)}
            self.column_indices = {name: i for i, name in
                                   enumerate(train_df.columns)}

            # Work out the window parameters.
            self.input_width = input_width
            self.label_width = label_width
            self.shift = shift

            self.total_window_size = input_width + shift

            self.input_slice = slice(0, input_width)
            self.input_indices = np.arange(self.total_window_size)[
                self.input_slice]

            self.label_start = self.total_window_size - self.label_width
            self.labels_slice = slice(self.label_start, None)
            self.label_indices = np.arange(self.total_window_size)[
                self.labels_slice]

        def __repr__(self):
            return '\n'.join([
                f'Total window size: {self.total_window_size}',
                f'Input indices: {self.input_indices}',
                f'Label indices: {self.label_indices}',
                f'Label column name(s): {self.label_columns}'])

    # Split window: Give a list of consecutive inputs split window converts them to a window of
    # inputs and a window of labels

    def split_window(self, features):
        inputs = features[:, self.input_slice, :]
        labels = features[:, self.labels_slice, :]
        if self.label_columns is not None:
            labels = tf.stack(
                [labels[:, :, self.column_indices[name]]
                    for name in self.label_columns],
                axis=-1)

        # Slicing doesn't preserve static shape information, so set the shapes
        # manually. This way the `tf.data.Datasets` are easier to inspect.
        inputs.set_shape([None, self.input_width, None])
        labels.set_shape([None, self.label_width, None])

        return inputs, labels

    WindowGenerator.split_window = split_window

    def plot(self, model=None, plot_col='temp_C', max_subplots=3):
        inputs, labels = self.example
        plt.figure(figsize=(12, 8))
        plot_col_index = self.column_indices[plot_col]
        max_n = min(max_subplots, len(inputs))
        for n in range(max_n):
            plt.subplot(max_n, 1, n + 1)
            plt.ylabel(f'{plot_col}')
            plt.plot(self.input_indices, inputs[n, :, plot_col_index] * train_std[plot_col] + train_mean[plot_col],
                     label='Inputs', marker='.', zorder=-10)

            if self.label_columns:
                label_col_index = self.label_columns_indices.get(plot_col, None)
            else:
                label_col_index = plot_col_index

            if label_col_index is None:
                continue

            plt.scatter(self.label_indices, labels[n, :, label_col_index] * train_std[plot_col] + train_mean[plot_col],
                        edgecolors='k', label='Labels', c='#2ca02c', s=64)
            if model is not None:
                predictions = model(inputs)
                plt.scatter(self.label_indices,
                            predictions[n, :, label_col_index] *
                            train_std[plot_col] + train_mean[plot_col],
                            marker='X', edgecolors='k', label='Predictions',
                            c='#ff7f0e', s=64)

            if n == 0:
                plt.legend()

        plt.xlabel('Time [h]')

    WindowGenerator.plot = plot

    # Make dataset takes a time series Dataframe and converts it to a dataset of
    # input_windows and label_windows. This method calls split_window

    def make_dataset(self, data):
        data = np.array(data, dtype=np.float32)
        ds = tf.keras.preprocessing.timeseries_dataset_from_array(
            data=data,
            targets=None,
            sequence_length=self.total_window_size,
            sequence_stride=1,
            shuffle=True,  # What does this even do?
            batch_size=32, )

        ds = ds.map(self.split_window)

        return ds

    WindowGenerator.make_dataset = make_dataset

    # These methods allow you to access training, validation and test data

    @property
    def train(self):
        return self.make_dataset(self.train_df)

    @property
    def val(self):
        return self.make_dataset(self.val_df)

    @property
    def test(self):
        return self.make_dataset(self.test_df)

    @property
    def example(self):
        """Get and cache an example batch of `inputs, labels` for plotting."""
        result = getattr(self, '_example', None)
        if result is None:
            # No example batch was found, so get one from the `.train` dataset
            result = next(iter(self.train))
            # And cache it for next time
            self._example = result
        return result

    WindowGenerator.train = train
    WindowGenerator.val = val
    WindowGenerator.test = test
    WindowGenerator.example = example

    val_performance = {}
    performance = {}

    # Number of epochs
    MAX_EPOCHS = 200

    def compile_and_fit(model, window, patience=2):
        early_stopping = tf.keras.callbacks.EarlyStopping(monitor='val_loss',
                                                          patience=patience,
                                                          mode='min')

        model.compile(loss=tf.losses.MeanSquaredError(),
                      optimizer=tf.optimizers.Adam(),
                      metrics=[tf.metrics.MeanAbsoluteError()])

        history = model.fit(window.train, epochs=MAX_EPOCHS,
                            validation_data=window.val,
                            callbacks=[early_stopping])
        return history

    # Initialize model. I'm using LSTM

    lstm_model = tf.keras.models.Sequential([
        # Shape [batch, time, features] => [batch, time, lstm_units]
        tf.keras.layers.LSTM(32, return_sequences=True),
        # Shape => [batch, time, features]
        tf.keras.layers.Dense(units=1)  # units is num_features to predict)
    ])

    # Create 2 windows
    # This is the window of data for temperature
    # Shift is number of hours into the future, change if needed

    # hours of data is the number of hours the prediction is based upon
    hours_of_data = 6
    num_hours_in_future = 1

    wide_window_temp = WindowGenerator(
        input_width=hours_of_data, label_width=hours_of_data, shift=num_hours_in_future,
        label_columns=['temp_C'])

    # This is the window of data for humidity
    wide_window_humd = WindowGenerator(
        input_width=hours_of_data, label_width=hours_of_data, shift=num_hours_in_future,
        label_columns=['rel_humidity_percent'])

    savedir_temp = ROOT_DIR + r'\model\model_save'
    savedir_humd = ROOT_DIR + r'\model\model_save_humd'

    temp_history = compile_and_fit(lstm_model, wide_window_temp)
    # Plot temperature model
    wide_window_temp.plot(lstm_model)
    plt.show()
    # Save temperature model
    lstm_model.save(savedir_temp, save_format='tf')

    humd_history = compile_and_fit(lstm_model, wide_window_humd)
    # Plot humdidity model
    wide_window_humd.plot(lstm_model)
    plt.show()
    # Save humdidity model
    lstm_model.save(savedir_humd, save_format='tf')

# createModel()
