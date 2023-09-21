# Author: Taea Lambert
# Date: 04/08/2021
# Version: 1.3
import json
import os
import pathlib
import re
from datetime import datetime, timedelta, timezone
from io import StringIO
from shutil import rmtree
from time import sleep

import pandas as pd
import pyrebase
import requests
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

from Prediction import PredictionDriver
from config import kumeu_river
from utils import SendNotification

directory_name = os.path.dirname(__file__)

# Location of exported weather data
csv_reports_path = pathlib.Path("csv-reports")

# Location of temp file containing latest weather data to be formatted
json_csv_path = pathlib.Path("json-csv")

# Location of temp file containing latest weather data to be formatted
secrets_file_path = pathlib.Path(directory_name, "secrets", "secrets.txt")


# Gets the metwatch account details stored in a file called secrets.txt
def get_metwatch_account_details():
    account = []
    # Check if secrets exists
    if not os.path.exists(secrets_file_path):
        print('WARNING: Secrets file does not exists. Please create one containing the account details')
        exit(-1)
    elif os.stat(secrets_file_path).st_size == 0:
        print('WARNING: Secrets file does not contain account details')
        exit(-1)

    # Read the file
    with open(secrets_file_path, mode='r',
              encoding='UTF-8') as secret_file:
        while line := secret_file.readline().rsplit():
            account.append(line)

    # Create payload
    payload = {
        'email': account[0][0],
        'password': account[1][0],
        'remember': 'on',
        'submit': ''
    }
    return payload


# Login into the Hortplus Metwatch website using the request method argument requires a payload that holds information
# about the account and returns a session object.
def metwatch_login(payload):
    # Create a request session object
    current_session = requests.Session()

    # Sends http method post to Hortplus Metwatch login page
    try:
        response = current_session.post('https://hortplus.metwatch.nz/index.php?pageNO=post_login', payload)
        print("Response completed in {0:.0f}s".format(response.elapsed.total_seconds()))
    except requests.exceptions.ConnectionError as e:
        print("[WARNING] Can not make a connection. Make sure there is a network connection.")
        print(e)
        print("Exiting...")
        exit(-1)

    return current_session


# Logouts of the hortplus-metwatch website safely using the request method argument requires takes in the
# current session
def metwatch_logout(session):
    response = session.get('https://hortplus.metwatch.nz/index.php?pageID=post_logout')
    print("Response completed in {0:.0f}s".format(response.elapsed.total_seconds()))
    return 0


# Gets latest search range of weather data from local time.
# Argument (is_date_format) takes a boolean which will format dates
# (True) will format as dd/mm/YYYY used by selenium input method
# (false) will format as YYYY/mm/dd used by the request method.
# Returns two values for the start of date and end of date
def get_search_dates(is_alt_date_format):
    # Format dates to dd-mm-yyyy
    date_current = datetime.now().strftime('%Y-%m-%d')
    date_tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
    date_yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')

    if is_alt_date_format:
        # Format dates to dd-mm-yyyy
        date_current = datetime.now().strftime('%d-%m-%Y')
        date_tomorrow = (datetime.now() + timedelta(days=1)).strftime('%d-%m-%Y')
        date_yesterday = (datetime.now() - timedelta(days=1)).strftime('%d-%m-%Y')

    # Sets the range of date to query for weather data
    date_input_start = date_current
    date_input_end = date_tomorrow

    # Check if the time is 0
    if datetime.now().time().hour == 0:
        # Sets the range of date to query for weather data
        date_input_start = date_yesterday
        date_input_end = date_current

    return date_input_start, date_input_end


# Gets exported weather data from the search range dates of weather data from local time and writes the data to disk.
# Argument (session) takes a authenticated session created from (metwatch_logout)
# Argument (start_date) start of the range of the date
# Argument (end_date) end of the range of the date
# Argument (station) the location weather station to query about.
def export_weather_data(session, start_date, end_date, station):
    current_session = session
    search_start_date = start_date
    search_end_date = end_date
    search_station = station

    print("Searching between " + start_date + " and " + end_date + " at " + search_station + ":")

    hour_weather_page = "https://hortplus.metwatch.nz/index.php?startdate={0}&stopdate={1}&station={2}&update=&pageID" \
                        "=wxn_hourly".format(search_start_date, search_end_date, search_station)

    # Get weather data with requested date frame
    request_result = None
    try:
        request_result = current_session.get(hour_weather_page)
        print("Response completed in {0:.0f}s".format(request_result.elapsed.total_seconds()))
    except requests.exceptions.ConnectionError as e:
        print("[WARNING] Can not make a connection. Make sure there is a network connection.")
        print(e)
        print("Exiting...")
        exit(-1)

    # Preferred method to get data
    print("Scrapping table..")
    # Get weather data by parsing the html docs looking html table
    is_success = get_export_weather_data_scrape(request_result)

    if is_success:
        return True  # Return True table data found
    else:
        return False  # Return False if could not find table data

    # Get weather data using http url get method for downloading a csv file
    # get_export_weather_data_button(current_session)


# noinspection PyTypeChecker
def get_export_weather_data_scrape(results):
    # Format filename as something like "MetWatch Export (Sat, 16 Oct 2021 02_52_46 +1300).csv"
    format_datetime_stamp = datetime.now(timezone(timedelta(hours=+13))).strftime('%a, %d %b %Y %H_%M_%S %z')
    report_csv_path = pathlib.Path("csv-reports", "MetWatch Export (" + format_datetime_stamp + ").csv")
    report_html_path = pathlib.Path("csv-reports", "MetWatch Export (" + format_datetime_stamp + ").html")

    try:
        # Read response content into data frame
        dfs = pd.read_html(results.content, header=0)[0]

        pd.set_option('display.max_columns', None)
        pd.set_option('display.width', None)

        print("----Results-----")
        print(dfs)
        print("----Results-----")

        # Write DataFrame to disk as csv file
        dfs.to_csv(report_csv_path, sep=',', index=False)
        dfs.to_html(report_html_path, header=True, index=False)

        print('Written into: "' + str(report_csv_path.resolve()) + '"')
    except ValueError as e:
        print(e)
        return False  # Return False if weather table data could not be found
    return True  # Return True if exporting weather data was successful


# Use requests to get data url https://hortplus.metwatch.nz/index.php?pageID=post_excel&key=RAWDATA
def get_export_weather_data_button_request(current_session):
    print("Getting exported weather data:")

    # Get exported data
    get_exported_data = ""
    try:
        get_exported_data = current_session.get('https://hortplus.metwatch.nz/index.php?pageID=post_excel&key=RAWDATA')
        print("Response completed in {0:.0f}s".format(get_exported_data.elapsed.total_seconds()))
    except requests.exceptions.ConnectionError as e:
        print("[WARNING] Can not make a connection. Make sure there is a network connection.")
        print(e)
        print("Exiting...")
        exit(-1)

    try:
        # Gets the filename from header
        filename = re.findall("filename=\"(.+)\"", get_exported_data.headers.get('Content-Disposition'))[0]

        # Replace any semicolon in the filename with space
        filename = filename.replace(":", "_")

        # Turns response text into to io object as pd.read_csv doesn't like response text
        data = StringIO(get_exported_data.text)

        clean_exported_data(data, filename)
    except TypeError:
        print("[WARNING] Data does not exist for Key")
    except AttributeError as e:
        print("[WARNING] There is no data in the header. Message:", e)


def clean_exported_data(data, filename):
    # Read data into data frame
    dataframe_clean = pd.read_csv(data, header=1)
    # Delete last row containing junk data
    dataframe_clean = dataframe_clean.head(dataframe_clean.shape[0] - 1)
    pd.set_option('display.max_columns', None)
    pd.set_option('display.width', None)
    print("----Results-----")
    print(dataframe_clean)
    print("----Results-----")
    # Write content to disk
    dataframe_clean.to_csv(pathlib.Path(csv_reports_path, filename), sep=',', header=True, index=False)
    print('Written into: "' + filename + '"')


def create_db_formatted_date():
    date_now = datetime.now()
    database_date_format = f'{date_now:%d}-{date_now:%m}-{date_now:%Y} {date_now.hour}'
    return database_date_format


def selenium_login(driver, payload):
    driver.get("https://hortplus.metwatch.nz/")
    driver.find_element(By.ID, "email").send_keys(payload.get('email'))
    driver.find_element(By.ID, "password").send_keys(payload.get('password'))
    driver.find_element(By.NAME, "submit").click()


def selenium_logout(driver):
    sleep(1)
    driver.find_element(By.LINK_TEXT, "Account").click()
    sleep(1)
    driver.find_element(By.LINK_TEXT, "Logout").click()
    sleep(1)
    print("Closing web driver...")
    driver.quit()


def selenium_update_hourly_input_data(driver, date_input_start, date_input_end):
    driver.get("https://hortplus.metwatch.nz/index.php?pageID=wxn_hourly")
    sleep(1)
    # Input start and end dates
    driver.find_element(By.ID, "startdate").click()
    driver.find_element(By.ID, "startdate").send_keys(date_input_start)
    driver.find_element(By.ID, "stopdate").click()
    driver.find_element(By.ID, "stopdate").send_keys(date_input_end)
    # Get the relevant data
    driver.find_element(By.NAME, "update").click()


# Use selenium driver to get data url https://hortplus.metwatch.nz/index.php?pageID=post_excel&key=RAWDATA
def selenium_get_export_weather_data_button(driver, download_path):
    driver.get("https://hortplus.metwatch.nz/index.php?pageID=post_excel&key=RAWDATA")
    sleep(1)
    print("Cleaning...")
    current_file = find_newest_file_download(download_path)
    print(current_file.name)
    clean_exported_data(current_file, current_file.name)


def find_newest_file_download(csv_location_download):
    file_names_dir = os.listdir(csv_location_download)
    file_list = []
    time_list = []

    for file_name in file_names_dir:
        if '.csv' == file_name[-4:]:
            # Gets the changed timestamp for the file
            changed_timestamp = os.path.getctime(pathlib.Path(csv_location_download, file_name))
            # Store the file name into a list
            file_list.append(pathlib.Path(csv_location_download, file_name))
            # Store the file name's changed timestamp into a list
            time_list.append(changed_timestamp)

    if len(time_list) < 1:
        print("[WARNING] Could not find latest .csv files.")
        exit(-1)
    else:
        newest_file = file_list[time_list.index(max(time_list))]
        return newest_file


def find_current_line_time():
    current_datetime = datetime.now()
    print("Getting current line time...")
    print("Current date time is: " + current_datetime.strftime('%Y-%m-%d %H:%M:%S'))

    # Sets which_day to previous datetime if its past midnight and its bee less than an hour since midnight.
    # which_day is used to determine to look at the day before when determine at looking at measurement metrics an hour
    # before midnight.
    which_day = current_datetime
    if current_datetime.hour == 0:
        which_day = datetime.now() - timedelta(1)  # Yesterday

    # Assign a string representing the date with the day suffix
    day_suffix = str(which_day.day) + (
        "th" if 4 <= which_day.day % 100 <= 20 else {1: "st", 2: "nd", 3: "rd"}.get(which_day.day % 10, "th"))
    result_string_date = which_day.strftime('%a ' + day_suffix + ' %b %Y')

    if current_datetime.hour == 0:
        result_string_time = "11 - 12am"
    elif current_datetime.hour == 1:
        result_string_time = "12 - 1am"
    elif current_datetime.hour == 12:
        result_string_time = "11 - 12pm"
    elif current_datetime.hour == 13:
        result_string_time = "12 - 1pm"
    elif current_datetime.hour >= 14:
        result_string_time = str(current_datetime.hour - 13) + " - " + str(current_datetime.hour - 12) + "pm"
    else:
        result_string_time = str(current_datetime.hour - 1) + " - " + str(current_datetime.hour) + "am"

    print("Result date is: " + result_string_date)
    print("Result time is: " + result_string_time)

    return result_string_date, result_string_time


def get_previous_hourly_data(df, result_string_date, result_string_time):
    df.columns = ['Date', 'Time', 'Temp', 'Rainfall (mm)', 'Leaf Wetness (%)', 'Relative Humidity (%)',
                  'Wind Speed (kmh)', 'Wind Direction', 'Spray Drift Risk', 'Backup Data', 'Missing Data']

    # Get the integer index of the row that matches requested label.

    row_index = df.index[(df['Date'] == result_string_date) & (df['Time'] == result_string_time)].tolist()[0]
    # Select the row with an index label of line_index
    row = df.iloc[[row_index]]

    print("...........................................................................................................")
    print("Found a match at index:", row_index)
    return row


def create_selected_row_csv(selected_row):
    row_csv_datastore_path = pathlib.Path("json-csv", "datastore.csv")
    selected_row.to_csv(row_csv_datastore_path, sep=',', na_rep='No', index=False)
    print("Written to", row_csv_datastore_path.resolve())


def setup_directories():
    # Create directories
    pathlib.Path(csv_reports_path).mkdir(parents=True, exist_ok=True)
    pathlib.Path(json_csv_path).mkdir(parents=True, exist_ok=True)


def check_data_exist_in_row(selected_row):
    print("Checking if current row has data...")
    # Checks if selected row has any data values (usually this checking for the value "All" in the 'Missing Data' index)
    # If the value 'All' is in 'Missing Data' then the row is consider has data missing.
    print("...........................................................................................................")
    if 'All' in selected_row.values:
        print("Found no measurement metrics:")
        is_data_exist = False
        is_data = -1
    else:
        print("Found measurement metrics:")
        is_data_exist = True
        is_data = 0
    print(selected_row)
    return is_data, is_data_exist


def get_weather_data_requests(payload):
    print("-----------------------------------------------------------------------------------------------------------")
    print("Getting weather data from Hortplus MetWatch using requests method...")
    # Gets latest data from recent dates
    # KMU has data available from 2016-05-01
    print("Setting search dates...")
    # Argument takes False boolean to get the format YYYY-mm-dd
    date_input_start, date_input_end = get_search_dates(False)
    # Station Kumeu
    station = "KMU"

    print("Logging in...")
    current_session = metwatch_login(payload)

    print("Getting weather data...")
    is_export_weather_data_success = export_weather_data(current_session, date_input_start, date_input_end, station)

    print("Logging Out...")
    metwatch_logout(current_session)

    if is_export_weather_data_success:
        return True  # Return True if data was exported
    else:
        return False  # Return False if could not export data


def get_weather_data_selenium(payload):
    print("-----------------------------------------------------------------------------------------------------------")
    print("Getting weather data from Hortplus MetWatch using selenium method...")
    # Save web driver binaries to project.root/.wdm
    os.environ['WDM_LOCAL'] = '1'
    # Options
    options = webdriver.ChromeOptions()
    options.headless = True

    # Service - specify geckodriver path
    sleep(1)  # Waits 1 second for before getting web driver
    service = Service(ChromeDriverManager(log_level=0, print_first_line=False, cache_valid_range=1).install())
    driver = webdriver.Chrome(service=service, options=options)

    driver.command_executor._commands["send_command"] = ("POST", '/session/$sessionId/chromium/send_command')
    params = {'cmd': 'Page.setDownloadBehavior',
              'params': {'behavior': 'allow', 'downloadPath': str(csv_reports_path.resolve())}}
    driver.execute("send_command", params)

    print("Setting search dates...")
    # Argument takes True boolean to get the format dd/mm/YYYY
    date_input_start, date_input_end = get_search_dates(True)

    print("Logging in...")
    selenium_login(driver, payload)

    # Move to the hourly page for metwatch sensor
    print("Querying weather data...")
    selenium_update_hourly_input_data(driver, date_input_start, date_input_end)

    print("Getting weather data...")
    selenium_get_export_weather_data_button(driver, csv_reports_path)

    print("Logging out...")
    selenium_logout(driver)


def push_data_to_firebase(data, database_date_format):
    firebase = pyrebase.initialize_app(kumeu_river.firebase_config)
    db = firebase.database()
    db.child("KumeuMetWatch").child("MetWatchAuto").child(database_date_format).set(data)
    print(data)
    print("Data written to Firebase database...")


def create_selected_row_json(csv_datastore_path):
    row_json_datastore_path = pathlib.Path(json_csv_path, "datastore.json")
    # Read csv file
    json_df = pd.read_csv(csv_datastore_path, sep=",", header=0)
    print(json_df)
    print()
    # Write to json
    json_df.to_json(row_json_datastore_path, orient="records")
    print("Written to", row_json_datastore_path.resolve())


def clean_up():
    for path in csv_reports_path.glob("**/*"):
        if path.is_file():
            path.unlink()
        elif path.is_dir():
            rmtree(path)

    for path in json_csv_path.glob("**/*"):
        if path.is_file():
            path.unlink()
        elif path.is_dir():
            rmtree(path)


def main():
    setup_directories()
    print("===========================================================================================================")

    # Create a payload with account details
    print("Getting payload...")
    payload = get_metwatch_account_details()

    # Get weather data using requests method
    is_success = get_weather_data_requests(payload)

    if not is_success:
        # Get weather data using selenium method
        print("Fall back to selenium method to get weather data")
        get_weather_data_selenium(payload)

    print("===========================================================================================================")

    # Find the latest modified file in download location (csv_download_location) that
    # is a .csv file and copy the file to location stated at the top (CSVPasteLocation)
    latest_csv_path = find_newest_file_download(csv_reports_path)
    print("Get the latest files is: " + str(latest_csv_path))
    print("-----------------------------------------------------------------------------------------------------------")
    print("Read latest csv file into dataframe...")
    # Read a csv file exported or scraped from Hortplus MetWatch
    df = pd.read_csv(latest_csv_path)
    # Replace the columns names to a known string format that will go to database
    df.columns = ['Date', 'Time', 'Temp', 'Rainfall (mm)', 'Leaf Wetness (%)', 'Relative Humidity (%)',
                  'Wind Speed (kmh)', 'Wind Direction', 'Spray Drift Risk', 'Backup Data', 'Missing Data']
    print("-----------------------------------------------------------------------------------------------------------")
    # Gets a string formatted date and time to be used as a key value to search for a row from data
    result_string_date, result_string_time = find_current_line_time()
    print("-----------------------------------------------------------------------------------------------------------")
    # Returns a row from a csv that corresponds to key value in 'Date' and 'Time' index
    print("Getting row matching previous hour \""
          + result_string_date + "\" and \""
          + result_string_time + "\" in:")
    print(str(latest_csv_path.resolve()))
    # Return a single row matching the corresponding date and time
    selected_row = get_previous_hourly_data(df, result_string_date, result_string_time)
    print("===========================================================================================================")
    # NOTES: Selected row can exists with date and time values but may not have measurement data
    # This method checks selected row has measurement metrics, sometimes measurements metrics may not exist for the
    # corresponding date time because there can be delay Hortplus Metwatch server may not have stored the data exactly
    # by the hour.
    is_data, is_data_exist = check_data_exist_in_row(selected_row)
    print("===========================================================================================================")
    # If there was no data in the current row for the current time then sleep for 5 minutes before trying again.
    if not is_data_exist:
        print("Measurement metric data does not currently exist for selected row. Trying again in 5 minute.")
        print(selected_row)
        print("Current time is", datetime.now().strftime('%c'))
        print("Trying again in 5 minute.. at", (datetime.now() + timedelta(minutes=5)).strftime('%c'))
        print("Cleaning up...")
        clean_up()  # Remove contents in csv-reports and json-csv folders
        sleep(300)  # 5 minutes
        main()  # Start loop again
    else:
        # Measurement metrics data does exist for selected row, process and push it to Firebase
        # NOTES: Creating csv could be skipped and just sending the selected row data to Firebase instead
        # Create a csv file with the selected row
        print("Creating csv file of selected row...")
        create_selected_row_csv(selected_row)
        datastore_csv_path = pathlib.Path(json_csv_path, "datastore.csv")
        print("-------------------------------------------------------------------------------------------------------")
        print("Creating Firebase json from csv...")
        create_selected_row_json(datastore_csv_path)
        print("-------------------------------------------------------------------------------------------------------")
        print("Reading json file containing selected data...")
        # Read Firebase json data
        selected_data_json_file = open(pathlib.Path(json_csv_path, "datastore.json"))
        data = json.load(selected_data_json_file)
        selected_data_json_file.close()
        print("-------------------------------------------------------------------------------------------------------")
        print("Generate formatted date for Firebase...")
        # Formats date to be stored in the database as 'dd-mm-yyyy H' eg. '06-09-2021 13'
        database_date_format = create_db_formatted_date()
        print("-------------------------------------------------------------------------------------------------------")
        print("Sending selected weather data to Firebase...")
        push_data_to_firebase(data, database_date_format)
        print("-------------------------------------------------------------------------------------------------------")
        print("Prediction...")
        PredictionDriver.main()
        print("-------------------------------------------------------------------------------------------------------")
        print("Sending Notification...")
        SendNotification.main()
        print("-------------------------------------------------------------------------------------------------------")
        print("Cleaning up...")
        clean_up()  # Remove contents in csv-reports and json-csv folders
    print("Exiting...")


main()
