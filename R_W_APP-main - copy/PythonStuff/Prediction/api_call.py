import requests


# print(response.status_code)


def get_API_predictions():
    response = requests.get(
        'https://api.openweathermap.org/data/2.5/onecall?lat=-36.776180&lon=174.557140&units=metric&exclude=current,minutely,daily,alerts&appid=65ff00cd31a301350cdd7c9043e955ea')

    hourly = response.json()['hourly']
    # for d in hourly:
    #     data = d['temp']
    #     time = datetime.utcfromtimestamp(d['dt']).strftime('%Y-%m-%d %H:%M:%S')
    #     cloud_pct = d['clouds']
    #     dew_point = d['dew_point']
    #     wind_speed = d['wind_speed']
    #     print("temp data: " + str(data) + " for date: " + time)
    #     print(cloud_pct)
    #     print(dew_point)
    #     print(wind_speed)

    return hourly
# Match up date and current time + 1

# send data to make prediction. ( call this from make prediction)

# avg my pred temp and this pred temp ( mypred + 2(thisPred))/3

# Pred frost using dew point. cloudy skies also play a part
# if wind < 4.5 and temp <= 0 and dew point <= temp
