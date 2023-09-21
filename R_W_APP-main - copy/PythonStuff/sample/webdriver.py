import os

# Store driver binaries into project.root/.wdm
os.environ['WDM_LOCAL'] = '1'
########################################################################################################################
# Chrome
# from selenium import webdriver
# from webdriver_manager.chrome import ChromeDriverManager
#
# options_chrome = webdriver.ChromeOptions()
# options_chrome.headless = True
#
# driver = webdriver.Chrome(executable_path=ChromeDriverManager().install(), options=options_chrome)
# driver.get("https://google.com")
# print('Chrome Done')
# driver.quit()

########################################################################################################################
# Chromium
# from selenium import webdriver
# from webdriver_manager.chrome import ChromeDriverManager
# from webdriver_manager.utils import ChromeType
#
# options_chromium = webdriver.ChromeOptions()
# options_chromium.headless = True
#
# driver = webdriver.Chrome(
#     executable_path=ChromeDriverManager(
#         chrome_type=ChromeType.CHROMIUM).install(), options=options_chromium)
# driver.get("https://google.com")
# print('Chromium Done')
# driver.quit()

########################################################################################################################
# FireFox
# from selenium import webdriver
# from webdriver_manager.firefox import GeckoDriverManager
#
# options_firefox = webdriver.FirefoxOptions()
# options_firefox.headless = True
#
# driver = webdriver.Firefox(executable_path=GeckoDriverManager().install(), options=options_firefox)
# driver.get("https://google.com")
# print('Firefox Done')
# driver.quit()

########################################################################################################################
# IE
# from selenium import webdriver
# from webdriver_manager.microsoft import IEDriverManager
#
# options_ie = webdriver.IeOptions()
# options_ie.headless = True
#
# driver = webdriver.Ie(executable_path=IEDriverManager('3.150').install(),options=options_ie)
# driver.get("https://google.com")
# print('IE Done')
# driver.quit()

########################################################################################################################
# Edge
# from selenium import webdriver
# from webdriver_manager.microsoft import EdgeChromiumDriverManager
#
# from selenium.webdriver.edge.options import Options
# options_edge = Options()
# options_edge.
#
# driver = webdriver.Edge(executable_path=EdgeChromiumDriverManager().install())
# driver.get("https://google.com")
# print('Edge Done')
# driver.quit()

########################################################################################################################
# # Opera
# from selenium import webdriver
# from webdriver_manager.opera import OperaDriverManager
#
# from selenium.webdriver.opera.options import Options
# options_opera = webdriver.ChromeOptions
# options_opera.headless = True
#
# driver = webdriver.Opera(executable_path=OperaDriverManager().install(), options=options_opera)
# driver.get("https://google.com")
# print('Opera Done')
# driver.quit()

########################################################################################################################
# driver.quit()
