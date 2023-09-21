# Taea lambert 
# 30-10-2021
# v1.0

from time import sleep



def LogoutNetworkServices():

    from selenium import webdriver
    options = webdriver.ChromeOptions()
    options.headless = True
    driver = webdriver.Chrome(options=options)
    driver.get("https://networkservices.aut.ac.nz/login.cgi")
    driver.find_element_by_name("logoff").click() 
    driver.quit()


if __name__ == '__main__':    
    LogoutNetworkServices()
