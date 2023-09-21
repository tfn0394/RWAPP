import os
from datetime import datetime, timedelta

import keras
import numpy as np
import pandas as pd
import tensorflow as tf

# displays full numbers in dataframes instead of scientific notation for clarity
from Prediction import api_call

pd.set_option('float_format', '{:f}'.format)
pd.set_option('display.max_columns', 500)
# Show all columns
pd.set_option('display.max_columns', None)
# Show all lines
pd.set_option('display.max_rows', None)
# value display length is 100, the default is 50
pd.set_option('max_colwidth', 100)

# This is duplicated. Needs to be fixed. For now just make sure the path
# for d (formattedDataPickle.pkl is the same in both CreateModel and
# MakePrediction)

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

train_mean = train_df.mean()
train_std = train_df.std()

train_df = (train_df - train_mean) / train_std
val_df = (val_df - train_mean) / train_std
test_df = (test_df - train_mean) / train_std


ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = ROOT_DIR + r"\PredictionFiles"

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


# Make dataset takes a time series Dataframe and converts it to a dataset of
# input_windows and label_windows. This method calls split_window

def make_dataset(self, data):
    data = np.array(data, dtype=np.float32)
    ds = tf.keras.preprocessing.timeseries_dataset_from_array(
        data=data,
        targets=None,
        sequence_length=self.total_window_size,
        sequence_stride=1,
        shuffle=False,  # What does this even do?
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


# This variable controls how far ahead the prediction is made
hours_to_predict = 1
hours_of_input = 6


def get_predictions(df):
    # Create 2 windows
    # This is the window of data for temperature

    wide_window_temp = WindowGenerator(
        input_width=hours_of_input, label_width=hours_of_input, shift=hours_to_predict,
        label_columns=['temp_C'])

    # This is the window of data for humidity
    wide_window_humd = WindowGenerator(
        input_width=hours_of_input, label_width=hours_of_input, shift=hours_to_predict,
        label_columns=['rel_humidity_percent'])

    # df = df.drop(["datetime_mid"], axis=1)

    # Normalize data
    df = (df - train_mean) / train_std

    # Saved model directories
    savedir_temp = ROOT_DIR + r'\model\model_save'
    savedir_humd = ROOT_DIR + r'\model\model_save_humd'

    loaded_model_temp = tf.keras.models.load_model(savedir_temp)  # Temperature
    loaded_model_humd = tf.keras.models.load_model(savedir_humd)  # Humidity

    length = df.shape[0]

    # Call plot and save to get df with prediction data
    temp_pred_list = plot_and_save(
        wide_window_temp, df, loaded_model_temp, plot_col="temp_C", max_subplots=length)
    humd_pred_list = plot_and_save(wide_window_humd, df, loaded_model_humd, plot_col="rel_humidity_percent",
                                   max_subplots=length)

    # List of predictions for both temp and humdity.
    # Temp prediction is the first item and humditiy pred is the second
    prediction_list = []
    print(temp_pred_list)

    # Add last prediction of temp to prediction_list as that is the next hours prediction
    prediction_list.append(temp_pred_list[-1])

    # prediction_list.append(temp_pred_list[0])

    # prediction_list.append(sum(temp_pred_list)/len(temp_pred_list))
    DateNow = datetime.now()
    hour_of_pred = (DateNow + timedelta(hours=1)).strftime('%Y-%m-%d %H')

    # Call API
    hourly = api_call.get_API_predictions()

    api_pred = []

    for d in hourly:
        time = datetime.fromtimestamp(d['dt']).strftime('%Y-%m-%d %H')
        temp = d['temp']
        print(temp, time)
        cloud_pct = d['clouds']
        dew_point = d['dew_point']
        wind_speed = d['wind_speed']
        humidity = d['humidity']
        print("temp data: " + str(temp) + " for date: " + time)
        # print(cloud_pct)
        # print(dew_point)
        # print(wind_speed)
        # print(hour_of_pred)
        if time == hour_of_pred:
            api_pred.append(temp)  # 0
            api_pred.append(humidity)  # 1
            api_pred.append(wind_speed)  # 2
            api_pred.append(cloud_pct)  # 3
            api_pred.append(dew_point)  # 4
            break

    prediction_list[0] = (prediction_list[0] + (2 * api_pred[0])) / 3

    # TODO: CHANGE THIS IN THE FUTURE FOR NOW
    prediction_list[0] = api_pred[0]
    # Add last prediction of humd to prediction_list as that is the next hours prediction
    # For some reason humd_pred_list is a 3d list so you need to go down 2 layers before getting the last value
    prediction_list.append(humd_pred_list[0][-1][-1])

    # prediction_list[1] = (prediction_list[1] + (2 * api_pred[1]))/3

    # TODO: CHANGE THIS
    prediction_list[1] = api_pred[1]

    # Get frost prediction from these values
    frost_pred = frost_prediction(
        prediction_list[0], prediction_list[1], api_pred[4], api_pred[2])

    # Add frost prediction to list
    prediction_list.append(frost_pred)

    reason_str = ["Predicted Temp: " + str(round(prediction_list[0], 1)) + "°C", "Dew Point: " + str(round(
        api_pred[4])) + "°C", "Wind Speed: " + str(round(api_pred[2])) + " m/s", "Cloud Cover: " + str(round(api_pred[3])) + "%"]
    prediction_list.append(reason_str)

    return prediction_list


# This function takes in 2 parameters, the predicted frost and predicted humidity and assigns a frost risk upon the
# above thresholds.
# Returns:
# 0 No Frost Risk
# 1 Low Frost Risk
# 2 Med Frost Risk
# 3 High Frost Risk
# 4 Very High Frost Risk

def frost_prediction(pred_temp, pred_humidity, pred_dew_point, pred_wind_speed):
    low_threshold_temp = 3
    med_threshold_temp = 0
    high_threshold_temp = -1.5
    med_threshold_humidity = 95
    high_threshold_humidity = 98

    frost_risk_str = ""
    frost_risk = 0
    if pred_temp < low_threshold_temp:
        frost_risk = 1
        if pred_temp < med_threshold_temp:
            frost_risk = 1
            if pred_humidity > med_threshold_humidity:
                frost_risk += 1
            if pred_temp < high_threshold_temp:
                frost_risk = 2
                if pred_humidity > high_threshold_humidity:
                    frost_risk += 1

    if pred_wind_speed < 4.5 and pred_temp < 0:
        frost_risk = 3
    if pred_dew_point < 0:
        frost_risk = 3
    if pred_dew_point < -2:
        frost_risk = 3

    if frost_risk == 0:
        frost_risk_str = "No Frost Risk"
    if frost_risk == 1:
        frost_risk_str = "Low Frost Risk"
    if frost_risk == 2:
        frost_risk_str = "Med Frost Risk"
    if frost_risk == 3:
        frost_risk_str = "High Frost Risk"

    return frost_risk_str


def plot_and_save(window, df, model=None, plot_col='temp_C', max_subplots=7):
    list_of_pred = []
    dataset = window.make_dataset(df)
    result = next(iter(dataset))

    inputs, labels = result
    pred = model.predict(inputs)
    # Denormalize the predictions
    pred = (pred * train_std[plot_col]) + train_mean[plot_col]
    # print(train_std[plot_col])
    # print(train_mean[plot_col])

    # print(pred[0])

    if plot_col == "rel_humidity_percent":
        hList = pred.tolist()
        hListFlat = []
        for sublist in hList:
            for item in sublist:
                if item[0] > 100:
                    item[0] = 100
            hListFlat.append(item[0])
        return hList

    else:
        tList = pred.tolist()
        tListFlat = []
        for sublist in tList:
            for item in sublist:
                tListFlat.append(item[0])
        return tListFlat


# IN case 7 data entries not found make pred on 2 entries
def get_backup_predictions():

    DateNow = datetime.now()
    hour_of_pred = (DateNow + timedelta(hours=1)).strftime('%Y-%m-%d %H')

    # Call API
    hourly = api_call.get_API_predictions()

    api_pred = []

    for d in hourly:
        time = datetime.fromtimestamp(d['dt']).strftime('%Y-%m-%d %H')
        temp = d['temp']
        if time == hour_of_pred:
            cloud_pct = d['clouds']
            dew_point = d['dew_point']
            wind_speed = d['wind_speed']
            humidity = d["humidity"]
            # print("temp data: " + str(temp) + " for date: " + time)
            # print(cloud_pct)
            # print(dew_point)
            # print(wind_speed)
            # print(hour_of_pred)
            api_pred.append(temp)
            api_pred.append(humidity)
            api_pred.append(wind_speed)
            api_pred.append(cloud_pct)
            api_pred.append(dew_point)
            break

    prediction_list = []

    prediction_list.append(api_pred[0])
    prediction_list.append(api_pred[1])

    # Get frost prediction from these values
    frost_pred = frost_prediction(
        prediction_list[0], prediction_list[1], api_pred[4], api_pred[2])

    # Add frost prediction to list
    prediction_list.append(frost_pred)

    reason_str = ["Predicted Temp: " + str(round(prediction_list[0], 1)), "Dew Point: " + str(round(
        api_pred[4])), "Wind Speed: " + str(round(api_pred[2])), "Cloud Cover: " + str(round(api_pred[3])) + "%"]
    prediction_list.append(reason_str)
    print(prediction_list[3][1])

    return prediction_list
