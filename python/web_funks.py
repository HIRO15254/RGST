from bs4 import BeautifulSoup
import requests
import urllib.parse as up
import urllib
import re
from os import path


def get_as(url, cookies=None, params={}):
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.88 Safari/537.36"}
        res = requests.get(url, cookies=cookies, params=params, headers=headers)
        return {"soup": BeautifulSoup(res.text, 'html.parser'), "cookie": res.cookies}
    except urllib.error.URLError as e:
        print(e)
        return None


def post_as(url, cookies=None, data=None):
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.88 Safari/537.36"}
        res = requests.post(url, cookies=cookies, data=data, headers=headers)
        return {"soup": BeautifulSoup(res.text, 'html.parser'), "cookie": res.cookies}
    except urllib.error.URLError as e:
        print(e)
        return None

def download_file(url, dst_path):
    try:
        with requests.get(url, headers={"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.88 Safari/537.36"}) as web_file, open(dst_path, 'wb') as local_file:
            local_file.write(web_file.content)
    except Exception as e:
        print(e)