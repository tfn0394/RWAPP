# Taea lambert 
# 30-10-2021
# v1.0

from selenium.webdriver.support import wait
from time import sleep

def getuserpassfromtxt(filename):
    """
    Reads a file with username and password separated by a colon.
    """
    with open(filename, 'r') as f:
        return f.readline().split(':')


def logintowebsiteselenium(username, password):
    """
    Logs into the AUT network services using seleniu .
    """
    from selenium import webdriver
    from selenium.webdriver.common.keys import Keys
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.common.by import By
    from selenium.common.exceptions import TimeoutException

    options = webdriver.ChromeOptions()
    options.headless = True
    driver = webdriver.Chrome(options=options)

    driver.get("https://networkservices.aut.ac.nz/login.cgi")
    driver.find_element_by_name("lgx1").send_keys(username)
    driver.find_element_by_name("pax1").send_keys(password)
    driver.find_element_by_name("time").send_keys(14);
    driver.find_element_by_name("login").click() 
    driver.quit()


if __name__ == '__main__':
    import os
    findfile = os.path.join(os.path.dirname(__file__), '../secrets/AUTNetwork.txt')
    username, password = getuserpassfromtxt(findfile)
    logintowebsiteselenium(username, password)
