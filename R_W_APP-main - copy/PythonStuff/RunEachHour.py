import os
import pathlib
from datetime import datetime, timedelta
from time import sleep

directory_name = os.path.dirname(__file__)
data_scrape_file_path = str(pathlib.Path(directory_name,"FinalDataScrape.py").resolve())

while True:
    print("||==========================================||")
    print("|| Starting RunEachHour.py...               ||")
    print("|| " + str(datetime.now()) + "              ||")
    print("|-------------------------------------------|")
    print("|-------------------------------------------|")
    print("| Running FinalDataScrape.py...             |")
    print("|-------------------------------------------|")
    os.system('python ' + data_scrape_file_path)
    print("|-------------------------------------------|")
    print("| Finished FinalDataScrape.py...            |")
    print("|-------------------------------------------|")
    print("|-------------------------------------------|")
    print("|| Sleeping...                              ||")
    print("|| " + str(datetime.now()) + "              ||")
    print("||==========================================||")

    dt = datetime.now() + timedelta(hours=1)
    dt = dt.replace(minute=10)

    while datetime.now() < dt:
        sleep(1)
