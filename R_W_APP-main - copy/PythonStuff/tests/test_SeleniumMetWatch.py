import os

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager


class TestSeleniumMetWatch():
    def setup_method(self, method):
        os.environ['WDM_LOCAL'] = '1'
        self.options = webdriver.ChromeOptions()
        self.options.headless = True
        self.service = Service(ChromeDriverManager(log_level=0, print_first_line=False, cache_valid_range=1).install())
        self.driver = webdriver.Chrome(service=self.service, options=self.options)
        self.vars = {} 

    def teardown_method(self, method):
        self.driver.quit()

    def test_get_weather_data(self):
        self.driver.get("https://hortplus.metwatch.nz/")
        self.driver.find_element(By.ID, "email").send_keys("michael@kumeuriver.co.nz")
        self.driver.find_element(By.ID, "password").send_keys("huntinghill")
        self.driver.find_element(By.NAME, "submit").click()
        self.driver.get("https://hortplus.metwatch.nz/index.php?pageID=wxn_hourly")
        self.driver.find_element(By.ID, "startdate").click()
        self.driver.find_element(By.ID, "startdate").send_keys("2021-10-16")
        self.driver.find_element(By.ID, "stopdate").click()
        self.driver.find_element(By.ID, "stopdate").send_keys("2021-10-17")
        self.driver.find_element(By.NAME, "update").click()
        self.driver.get("https://hortplus.metwatch.nz/index.php?pageID=post_excel&key=RAWDATA")
        self.driver.find_element(By.LINK_TEXT, "Account").click()
        self.driver.find_element(By.LINK_TEXT, "Logout").click()

    def test_1login(self):
        self.driver.get("https://hortplus.metwatch.nz/")
        self.driver.find_element(By.ID, "email").send_keys("michael@kumeuriver.co.nz")
        self.driver.find_element(By.ID, "password").send_keys("huntinghill")
        self.driver.find_element(By.NAME, "submit").click()

    def test_update_date_inputs(self):
        self.driver.get("https://hortplus.metwatch.nz/")
        self.driver.find_element(By.ID, "email").send_keys("michael@kumeuriver.co.nz")
        self.driver.find_element(By.ID, "password").send_keys("huntinghill")
        self.driver.find_element(By.NAME, "submit").click()
        self.driver.get("https://hortplus.metwatch.nz/index.php?pageID=wxn_hourly")
        self.driver.find_element(By.ID, "startdate").click()
        self.driver.find_element(By.ID, "startdate").send_keys("2021-10-16")
        self.driver.find_element(By.ID, "stopdate").click()
        self.driver.find_element(By.ID, "stopdate").send_keys("2021-10-22")
        self.driver.find_element(By.NAME, "update").click()

    def test_download_weather_data(self):
        self.driver.get("https://hortplus.metwatch.nz/")
        self.driver.find_element(By.ID, "email").send_keys("michael@kumeuriver.co.nz")
        self.driver.find_element(By.ID, "password").send_keys("huntinghill")
        self.driver.find_element(By.NAME, "submit").click()
        self.driver.get("https://hortplus.metwatch.nz/index.php?pageID=wxn_hourly")
        self.driver.get("https://hortplus.metwatch.nz/index.php?pageID=post_excel&key=RAWDATA")

    def test_logout(self):
        self.driver.get("https://hortplus.metwatch.nz/")
        self.driver.find_element(By.ID, "email").send_keys("michael@kumeuriver.co.nz")
        self.driver.find_element(By.ID, "password").send_keys("huntinghill")
        self.driver.find_element(By.NAME, "submit").click()
        self.driver.find_element(By.LINK_TEXT, "Account").click()
        self.driver.find_element(By.LINK_TEXT, "Logout").click()
