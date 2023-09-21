import numpy as np
import pandas as pd

# Show all columns

pd.set_option('display.max_columns', None)
# Show all lines
pd.set_option('display.max_rows', None)
# value display length is 100, the default is 50
pd.set_option('max_colwidth', 100)

# displays full numbers in dataframes instead of scientific notation for clarity
pd.set_option('float_format', '{:f}'.format)
pd.set_option('display.max_columns', 500)


def process_data(df):
    # DF is in the format:
    # Date,  Leaf Wetness (%),  Rainfall (mm),  Relative Humidity (%), Spray Drift Risk, Temp, Time, Wind Direction,  Wind Speed (km h), mid, end
    # date wetness_percent rain_mm rel_humidity_percent spray_drift_risk
    # temp_C time_hourly wind_direction wind_speed_kmph mid end

    # import datetime_mid as date and mid hour
    # rename columns
    # Drop columns

    print(df.columns)

    df.columns = ['backup_data','date', 'wetness_percent', 'missing_data', 'rain_mm', 'rel_humidity_percent', 'spray_drift_risk', 'temp_C',
                  'time_hourly', 'wind_direction', 'wind_speed_kmph', 'mid', 'end_hour']

    d = df.copy()

    d['datetime_mid'] = d['date'] + ' ' + d['mid']

    d['datetime_mid'] = pd.to_datetime(
        d['datetime_mid'], format="%d-%m-%Y %H:%M")

    d["end_hour"] = pd.to_numeric(d["end_hour"])

    d.drop(labels=['backup_data','spray_drift_risk', 'time_hourly', 'wind_direction', 'rain_mm',
                   'mid', 'missing_data'], axis=1, inplace=True)

    d = d.dropna()

    # Creating the cyclical daily feature
    d["day_cos"] = [np.cos(x * (2 * np.pi / 24)) for x in d["end_hour"]]
    d["day_sin"] = [np.sin(x * (2 * np.pi / 24)) for x in d["end_hour"]]

    # Extracting the timestamp from the datetime object
    d["timestamp"] = [x.timestamp() for x in d["datetime_mid"]]
    # Seconds in day
    s = 24 * 60 * 60
    # Seconds in year
    year = 365.25 * s
    d["month_cos"] = [np.cos((x) * (2 * np.pi / year)) for x in d["timestamp"]]
    d["month_sin"] = [np.sin((x) * (2 * np.pi / year)) for x in d["timestamp"]]

    d = d.drop(["datetime_mid"], axis=1)

    return d
