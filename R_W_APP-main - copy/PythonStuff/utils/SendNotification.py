from datetime import datetime, timedelta

import pyrebase
import yagmail
# import kumeu river user configurations
from config import kumeu_river

firebase = pyrebase.initialize_app(kumeu_river.firebase_config)
db = firebase.database()


# settingsData = db.ref('NotificationSettings/').get()


def getTempData():
    weatherData = db.child("KumeuMetWatch").child(
        "MetWatchAuto").get()

    DateNow = datetime.now()

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

    datetime_str = current_day + "-" + current_month + "-" + \
                   str(current_year) + " " + str(current_hour)

    currentWeather = []

    i = 0
    for item in weatherData:
        key = weatherData[i].key()
        if (key == datetime_str):
            currentWeather.append(weatherData[i].val())
            break

        i += 1

    currentTemp = currentWeather[0][0].get("Temp")

    return currentTemp


def getPredTempData():
    predWeatherData = db.child("KumeuMetWatch").child(
        "MetwatchPrediction").get()

    DateNow = datetime.now()

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

    current_hour = datetime.strptime(str(DateNow.hour), "%H")
    current_year = DateNow.year
    # One hour in the future

    current_hour = current_hour + timedelta(hours=1)
    current_hour = current_hour.strftime("%H")

    datetime_str = current_day + "-" + current_month + "-" + \
                   str(current_year) + " " + str(current_hour)

    predWeather = []

    i = 0
    for item in predWeatherData:
        key = predWeatherData[i].key()
        if (key == datetime_str):
            predWeather.append(predWeatherData[i].val())
            print(key)
            break

        i += 1

    predictedTemp = predWeather[0].get("pTemp")
    frost = predWeather[0].get("pFrost")
    forDate = predWeather[0].get("date")

    # Returns data from firebase about predictions in order:
    # pTemp, pFrost, Date(hour) of pred
    returnList = []
    returnList.append(predictedTemp)
    returnList.append(frost)
    returnList.append(forDate)

    return returnList


def getSettingData():
    settings = db.child("NotificationSettings").child("KumeuMetWatch").get()

    return settings


def SendEmail(emailAdress, subject, body):
    yag = yagmail.SMTP(r'RnD.KRW.APP@gmail.com', r'R&DKRWproject2021')
    yag.send(emailAdress, subject, body)


def main():
    try:
        settings = getSettingData()

        pushEnabled = settings.val().get("pushEnabled")
        emailAdress = settings.val().get("emailAdress")
        actualTempAlert = settings.val().get("actualTempAlert")
        actualTempThreshold = settings.val().get("actualTempThreshold")
        predTempAlert = settings.val().get("predTempAlert")
        predTempThreshold = settings.val().get("predTempThreshold")
        LowFrostRisk = settings.val().get("LowFrostRisk")
        MedFrostRisk = settings.val().get("MedFrostRisk")
        HighFrostRisk = settings.val().get("HighFrostRisk")

        # Get this data from firebase
        actualTemp = getTempData()
        predList = getPredTempData()
        predTemp = predList[0]
        frostRisk = predList[1]
        hourOfPrediction = predList[2]

        if (pushEnabled == True):
            if (actualTempAlert == True):
                if (actualTemp <= float(actualTempThreshold)):
                    body = "Recorded Temperature is " + str(actualTemp) + "°C"
                    SendEmail(emailAdress, "Recorded Temperature Below Threshold", body)

            if (predTempAlert == True):
                if (predTemp <= float(predTempThreshold)):
                    # send notification
                    body = "Predicted Temperature is " + str(predTemp) + "°C"
                    SendEmail(emailAdress, "Predicted Temperature Below Threshold", body)

            if (LowFrostRisk == True):
                if (frostRisk == "Low"):
                    # send notification
                    body = frostRisk + " Frost Chance"
                    SendEmail(emailAdress, "Frost Chance Above Threshold", body)

            if (MedFrostRisk == True):
                if (frostRisk == "Med"):
                    # send notification
                    body = frostRisk + " Frost Chance"
                    SendEmail(emailAdress, "Frost Chance Above Threshold", body)

            if (HighFrostRisk == True):
                if (frostRisk == "High"):
                    # send notification
                    body = frostRisk + " Frost Chance"
                    SendEmail(emailAdress, "Frost Chance Above Threshold", body)
    except Exception as e:
        print(e)
