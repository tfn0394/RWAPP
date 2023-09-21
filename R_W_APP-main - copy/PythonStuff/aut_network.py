import os

import requests
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium import webdriver


class AutNetworkService():
    # options_chrome = webdriver.ChromeOptions()
    # options_chrome.headless = True
    # driver = webdriver.Chrome(executable_path=ChromeDriverManager().install(), options=options_chrome)

    def __init__(self):
        self.vars = {}
        self.options = webdriver.ChromeOptions()
        self.options.headless = True
        # self.driver = webdriver.Chrome(executable_path=ChromeDriverManager().install(), options=self.options_chrome)
        self.driver = webdriver.Chrome(options=self.options)
        self.vars = {}

    def get_account_details(self):
        print(os.path.dirname(__file__))
        filename = os.path.join(os.path.dirname(__file__), 'secrets\\AUTNetwork.txt')
        with open(filename, 'r') as f:
            return f.readline().split(':')



    def teardown_method(self):
        self.driver.quit()

    def test_login(self):
        print("Logging into AUT Network Services...")
        self.driver.get("https://networkservices.aut.ac.nz/login.cgi")
        self.driver.set_window_size(610, 790)
        self.driver.find_element(By.ID, "lgx1").send_keys(self.get_account_details()[0])
        self.driver.find_element(By.ID, "pax1").send_keys(self.get_account_details()[1])
        dropdown = self.driver.find_element(By.ID, "time")
        dropdown.find_element(By.XPATH, "//option[. = '14 hours']").click()
        self.driver.find_element(By.NAME, "login").click()

    def test_logout(self):
        print("Logging out of AUT Network Services...")
        try:
            self.driver.get("https://networkservices.aut.ac.nz/login.cgi")
            self.driver.set_window_size(610, 790)
            self.driver.find_element(By.NAME, "logoff").click()
        except requests.exceptions.SSLError as e:
            print(e)
        except NoSuchElementException as e:
            self.test_login()
            # print(e)
