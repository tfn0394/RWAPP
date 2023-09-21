import os

from Prediction import GetDataFromFirebase, PredictionToFirebase, DataPreProcessing
from Prediction.CreateModel import createModel
from Prediction.MakePrediction import get_backup_predictions, get_predictions


def main():
    try:
        # Get data from Firebase # Should be 7 entries of data ( 1 + num_hours of historical data to predict with)

        try:
            # Get data returns a df of 7 entries of raw data from firebase. These
            # values are from the current hour to 6 hours ago.
            df = GetDataFromFirebase.getData()
            backup = False
            # df= df.iloc[::-1]
            df.sort_values(by=["end"], inplace=True)
            # print(df)
        except Exception as e:
            print("Reading data failed")
            print(e)
            backup = True

            # This if statemants allows predictions to be sent even if there isn't a single data point
        if not backup:
            if (df.shape[0] < 7):
                # 7 data points were not found. call backup pred
                backup = True
            # Call DataPreProcessing to clean data. Returns dataframe
            clean_data = DataPreProcessing.process_data(df)

            # print(clean_data)
            clean_data.drop("date", inplace=True, axis=1)

        # Check if model exists. If not Create model
        # Saved model directories

        ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
        ROOT_DIR = ROOT_DIR + r"\PredictionFiles"
        savedir_temp = ROOT_DIR + r'\model\model_save'

        if os.path.isdir(savedir_temp):
            print("Model exists")
        else:
            print("Model does not exist -- Creating model")
            createModel()

        # Call MakePrediction to get prediction. Returns a list of predictions.
        # First item is temp prediction. Second item is humditiy prediction. Third item is frost prediction as a string
        if not backup:
            # list_of_prediction = get_predictions(clean_data)
            # something wrong with tf model. For now always call backup
            list_of_prediction = get_backup_predictions()

        else:
            list_of_prediction = get_backup_predictions()

        print(list_of_prediction)

        # Call PredictionToFirebase with JSON of data
        PredictionToFirebase.send_pred(list_of_prediction)

    except Exception as e:
        print("Prediction error occured. No data added to firebase.")
        print(e)


main()
