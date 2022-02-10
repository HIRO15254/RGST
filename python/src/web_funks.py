from typing import TypedDict
from bs4 import BeautifulSoup
import requests
import urllib


class webResponceDict(TypedDict):
    soup: BeautifulSoup
    cookie: dict


def get(url: str, cookies: dict = None, params: dict = None) -> webResponceDict:
    """指定URLにGETリクエストを送って、レスポンスを返す

    Args:
        url (str): 取得するwebページのURL
        cookies (dict, optional): クッキーデータを格納した辞書型配列。
        params (dict, optional): URLに付与するパラメーターを格納した辞書型配列。

    Returns:
        dict: {
            "soup": Beautifulsoup 取得したレスポンスをパースしたBeautifulSoupオブジェクト。
            cookies: 取得したレスポンスから送られたcookie。
        }
    """
    try:
        headers = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.88 Safari/537.36"}
        res = requests.get(url, cookies=cookies, params=params, headers=headers)
        return {
            "soup": BeautifulSoup(res.text, 'html.parser'),
            "cookie": res.cookies
        }
    except urllib.error.URLError as e:
        print(e)
        return None


def post(url: str, cookies: dict = None, data: dict = None) -> webResponceDict:
    """指定URLにPOSTリクエストを送って、レスポンスを返す

    Args:
        url (str): 取得するwebページのURL
        cookies (dict, optional): クッキーデータを格納した辞書型配列。
        params (dict, optional): URLに付与するパラメーターを格納した辞書型配列。

    Returns:
        dict: {
            "soup": Beautifulsoup 取得したレスポンスをパースしたBeautifulSoupオブジェクト。
            cookies: 取得したレスポンスから送られたcookie。
        }
    """
    try:
        headers = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.88 Safari/537.36"}
        res = requests.post(url, cookies=cookies, data=data, headers=headers)
        return {
            "soup": BeautifulSoup(res.text, 'html.parser'),
            "cookie": res.cookies
        }
    except urllib.error.URLError as e:
        print(e)
        return None


def download_file(url: str, dst_path: str):
    """指定したURLのコンテンツをそのままローカルに保存する

    Args:
        url (str): コンテンツを取得するURL
        dst_path (str): 取得したコンテンツを保存するパス(拡張子を含む)
    """
    try:
        headers = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.88 Safari/537.36"}
        with requests.get(url, headers=headers) as web_file, open(dst_path, 'wb') as local_file:
            local_file.write(web_file.content)
    except Exception as e:
        print(e)
