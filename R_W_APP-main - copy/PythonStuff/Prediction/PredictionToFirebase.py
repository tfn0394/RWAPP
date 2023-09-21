import datetime
import pyrebase
# from config import kumeu_river
import datetime

import pyrebase

from config import kumeu_river

firebase = pyrebase.initialize_app(kumeu_river.firebase_config)
db = firebase.database()

# f = open('D:\Downloads\kumeu_data\data\Weather Station Hourly\June2020Pred.json', "r")
# data = json.load(f)
# f.close()


def send_pred(list_of_data):
    DateNow = datetime.datetime.now()

    if(DateNow.day < 10):
        if(DateNow.month < 10):
            if(DateNow.hour < 10):
                Child2 = "0" + str(DateNow.day) + "-0" + str(DateNow.month) + \
                    "-" + str(DateNow.year) + " " + str(DateNow.hour)
            else:
                Child2 = "0" + str(DateNow.day) + "-0" + str(DateNow.month) + \
                    "-" + str(DateNow.year) + " " + str(DateNow.hour)
        else:
            if(DateNow.hour < 10):
                Child2 = "0" + str(DateNow.day) + "-" + str(DateNow.month) + \
                    "-" + str(DateNow.year) + " " + str(DateNow.hour)
            else:
                Child2 = "0" + str(DateNow.day) + "-" + str(DateNow.month) + \
                    "-" + str(DateNow.year) + " " + str(DateNow.hour)
    else:
        if(DateNow.month < 10):
            if(DateNow.hour < 10):
                Child2 = str(DateNow.day) + "-0" + str(DateNow.month) + \
                    "-" + str(DateNow.year) + " " + str(DateNow.hour)
            else:
                Child2 = str(DateNow.day) + "-0" + str(DateNow.month) + \
                    "-" + str(DateNow.year) + " " + str(DateNow.hour)
        else:
            if(DateNow.hour < 10):
                Child2 = str(DateNow.day) + "-" + str(DateNow.month) + \
                    "-" + str(DateNow.year) + " " + str(DateNow.hour)
            else:
                Child2 = str(DateNow.day) + "-" + str(DateNow.month) + \
                    "-" + str(DateNow.year) + " " + str(DateNow.hour)

    if(DateNow.day < 10):
        if(DateNow.month < 10):
            if(DateNow.hour < 10):
                Child = "0" + str(DateNow.day) + "-0" + str(DateNow.month) + \
                    "-" + str(DateNow.year) + " " + str(DateNow.hour + 1)
            else:
                Child = "0" + str(DateNow.day) + "-0" + str(DateNow.month) + \
                    "-" + str(DateNow.year) + " " + str(DateNow.hour + 1)
        else:
            if(DateNow.hour < 10):
                Child = "0" + str(DateNow.day) + "-" + str(DateNow.month) + \
                    "-" + str(DateNow.year) + " " + str(DateNow.hour + 1)
            else:
                Child = "0" + str(DateNow.day) + "-" + str(DateNow.month) + \
                    "-" + str(DateNow.year) + " " + str(DateNow.hour + 1)
    else:
        if(DateNow.month < 10):
            if(DateNow.hour < 10):
                Child = str(DateNow.day) + "-0" + str(DateNow.month) + \
                    "-" + str(DateNow.year) + " " + str(DateNow.hour + 1)
            else:
                Child = str(DateNow.day) + "-0" + str(DateNow.month) + \
                    "-" + str(DateNow.year) + " " + str(DateNow.hour + 1)
        else:
            if(DateNow.hour < 10):
                Child = str(DateNow.day) + "-" + str(DateNow.month) + \
                    "-" + str(DateNow.year) + " " + str(DateNow.hour + 1)
            else:
                Child = str(DateNow.day) + "-" + str(DateNow.month) + \
                    "-" + str(DateNow.year) + " " + str(DateNow.hour + 1)

    # Change the date or hour  of the child below if you want to make historical prodictions
    # Child = "19-09-2021 16"
    print(Child2)
    print(Child)
    time_prediction_made = Child

    # Add 1 hour to current time as time of prediction. eg prediction made at 3pm is a prediction for 4 pm
    delta = datetime.timedelta(hours=1)
    pred_datetime = datetime.datetime.strptime(Child, '%d-%m-%Y %H')
    pred_datetime = pred_datetime + delta
    # Child = pred_datetime.strftime('%d-%m-%Y %H')

    print(Child)

    # Child = "08-10-2021 16"
    # pTemp = 17.5
    # pHumd = 80
    # pFrost = "No Frost Risk"
    # datePredMade = "08-10-2021 16"
    # reason = ""

    # data_dict = {"pTemp": pTemp, "pHumd": pHumd, "pFrost": pFrost,
    #              "date": Child, "datePredMade": datePredMade, "reason": reason}

    data_dict = {"pTemp": round(list_of_data[0], 1), "pHumd": round(
        list_of_data[1], 1), "pFrost": list_of_data[2], "date": Child, "datePredMade": Child2, "reason": list_of_data[3]}

    db.child("KumeuMetWatch").child(
        "MetwatchPrediction").child(Child).set(data_dict)

    print("Prediction for " + Child + " sent")

# pip install firebase-admin
# pip install pyrebase4
# If there are errors with crypto go to this location within your computer and:

# ```
# \appdata\local\programs\python\python39\lib\site-packages\
# "crypto" folder to "Crypto"
# ```


# Change the child from MetWatchAuto to anything you would like that makes sense to you.
#   The child data veriable contains the date of today and the hour in 24 hour time
# if you would like you could add a minute and second time to the child verable above
# example:

# Child = str(DateNow.day) + "-" + str(DateNow.month) + "-" + \
#     str(DateNow.year) + " " + str(DateNow.hour) + str(DateNow.hour)

# send_pred()
