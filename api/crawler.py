from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager
import time 
import uuid

options = webdriver.ChromeOptions()
options.add_argument('--ignore-certificate-errors')
options.add_argument("--headless")
options.add_experimental_option("excludeSwitches", ["enable-logging"])
options.add_argument("--log-level=3") 
driver = webdriver.Chrome(ChromeDriverManager().install(), chrome_options=options)

random_userid = uuid.uuid1()

driver.get('https://www.nftport.xyz/sign-up')
driver.maximize_window()

text_input = driver.find_element_by_xpath('//*[@id="name-2"]')
text_input.send_keys('test user')

text_input = driver.find_element_by_xpath('//*[@id="organisation"]')
text_input.send_keys('test org')

text_input = driver.find_element_by_xpath('//*[@id="email-2"]')
text_input.send_keys('{user}@mailinator.com'.format(user=random_userid))

text_input = Select(driver.find_element_by_xpath('//*[@id="What-are-you-building-with-NFTs"]'))
text_input.select_by_visible_text('Collection')

dropdown1 = Select(driver.find_element_by_xpath('//*[@id="team_size-5"]'))
dropdown1.select_by_visible_text('1')

search_button = driver.find_element_by_xpath('//*[@id="wf-form-Sign-up"]/input[4]')
search_button.click()

driver.get('https://www.mailinator.com/v4/public/inboxes.jsp?to={user}'.format(user=random_userid))
driver.maximize_window()

time.sleep(5)

email = driver.find_elements_by_xpath("//*[contains(@id,'row_{user}')]/td[3]".format(user=random_userid))[0]
email.click()

driver.switch_to.frame("html_msg_body");
time.sleep(5)

mail_text = driver.find_element_by_xpath('/html/body').text

import re
regex = '[a-z0-9]*-[a-z0-9]*-[a-z0-9]*-[a-z0-9]*-[a-z0-9]*'
match = re.findall(regex, mail_text) 

print('\n\nAPI Key : {key}\n\n'.format(key=match[0]))
driver.quit()

