import datetime

import pandas as pd
import pyrebase

# import kumeu river user configurations
from config import kumeu_river

firebase = pyrebase.initialize_app(kumeu_river.firebase_config)
db = firebase.database()

all_data = db.child("KumeuMetWatch").child(
    "MetWatchAuto").get()  # .child(Child)


def getData():
    DateNow = datetime.datetime.now()

    if DateNow.day > 9:
        current_day = str(DateNow.day)
    else:
        current_day = str(DateNow.day)
        current_day = '0' + current_day

    if DateNow.month > 9:
        current_month = str(DateNow.month)
    else:
        current_month = str(DateNow.month)
        current_month = '0' + current_month

    current_hour = DateNow.hour
    current_year = DateNow.year

    # if you would like to input past data just set the current hour / day / month as needed
    # update date and hour in predictiontoFirebase too
    # current_day = "19"
    # current_hour = 16

    datetime_str = current_day + "-" + current_month + "-" + \
        str(current_year) + " " + str(current_hour)

    list_of_datetime = []

    # 7 entries needed for a 6 hour prediction one hour into the future
    for i in range(7):
        list_of_datetime.append(datetime_str)
        current_hour = int(current_hour)
        current_hour -= 1
        if current_hour <= 9:
            current_hour = str(current_hour)
        datetime_str = str(current_day) + "-" + str(current_month) + "-" + \
            str(current_year) + " " + \
            str(current_hour)  # + "-" + current_minute
        # if end hour = 0 go back 1 day
        if (current_hour == 0):
            current_day -= 1
            # Only 23 hours in db but current hour gets minused by 1 before being set
            current_hour = 24
        i = + 1

    # data is a list of a list of a dict
    data = []
    list_of_keys = []

    # Finds values from key and adds it to a list
    i = 0
    for item in all_data:
        key = all_data[i].key()
        if (key == list_of_datetime[0] or key == list_of_datetime[1] or key == list_of_datetime[2] or key ==
                list_of_datetime[3]
                or key == list_of_datetime[4] or key == list_of_datetime[5] or key == list_of_datetime[6]):
            list_of_keys.append(key)
            print(key, " Found")
            data.append(all_data[i].val())
            if(len(data) == 7):
                break
        i += 1

    if len(data) < 7:
        # Missing data. Go ahead with backup prediction. Delete all but last 2 hours of data
        backup_data = []
        backup_data.append(data[-1])
        try:
            backup_data.append(data[-2])
        except BaseException:
            backup_data.append(data[-1])
        try:
            backup_data.append(data[-3])
        except BaseException:
            try:
                backup_data.append(data[-2])
            except BaseException:
                backup_data.append(data[-1])

        data = backup_data

    # Turn list of list of dict to list of dict
    flat_data = []
    for sublist in data:
        for dictionary in sublist:
            flat_data.append(dictionary)

    # Fix date to be a useful format
    for i in range(len(flat_data)):
        dict = flat_data[i]
        dict["Date"] = (dict["Date"]).replace("st", "").replace(
            "nd", "").replace("rd", "").replace("th", "")
        try:
            dict["Date"] = datetime.datetime.strptime(
                dict["Date"], '%a %d %b %Y').date().strftime("%d-%m-%Y")
        except BaseException:
            dict["Date"] = datetime.datetime.strptime(
                dict["Date"], '%d-%m-%Y').date().strftime("%d-%m-%Y")

    # Fix time to be a useful format
    for i in range(len(flat_data)):
        dict = flat_data[i]
        dict["Time"] = dict["Time"].replace(
            "am", " am").replace("pm", " pm").replace("-", "")
        hour_list = []
        identifier = ""
        for word in dict["Time"].split():
            if word == "pm":
                identifier = 'pm'
            if word == "am":
                identifier = "am"
            if word.isdigit():
                hour_list.append(int(word))
        hour_str = str(hour_list[1]) + identifier
        # Get end hour only
        delta = datetime.timedelta(minutes=30)
        end_hour = datetime.datetime.strptime(hour_str, '%I%p')
        mid_hour = end_hour - datetime.timedelta(minutes=30)
        dict["mid"] = mid_hour.time().strftime("%H:%M")
        dict["end"] = end_hour.time().strftime("%H")
    df = pd.DataFrame(flat_data)

    return df

# getData()
