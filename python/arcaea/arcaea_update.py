import re
import time
import urllib.parse as up
from typing import Any, Final, TypedDict

import json_funks
import to_hist
import web_funks
from bs4 import BeautifulSoup

# URLの定数定義
WIKI_SONGLIST_URL: Final[str] = "https://wikiwiki.jp/arcaea/%E3%83%91%E3%83%83%E3%82%AF%E9%A0%86"
WIKI_RECENT_UPDATE_URL: Final[str] = "https://wikiwiki.jp/arcaea/RecentChanges"


class diffDictRequired(TypedDict):
    past: Any
    present: Any
    future: Any


class diffDictOptional(TypedDict, total=False):
    beyond: Any


class diffDict(diffDictRequired, diffDictOptional):
    pass


def arcaea_updade(data_path: str, jackets_path: str):
    """Arcaea wikiから情報を取得し更新する

    Args:
        data_path (str): データを保存するjsonファイルのパス
        jacket_path (str): ジャケットデータを保存するフォルダのパス
    """
    datas: dict = json_funks.get_json(data_path)

    def list_to_diffdict(list_: list[Any]) -> diffDict:
        """listをArcaeaの難易度と対応させたdictにして返す

        Args:
            list_ (list[Any]): 変換したいlist

        Returns:
            diffDict: Arcaeaの難易度と対応させたdict
        """
        ret: diffDict = dict()
        diff_names = ["past", "present", "future", "beyond"]
        for i in range(4):
            if len(list_) > i:
                ret[diff_names[i]] = list_[i]
        return ret

    def get_song_pages() -> list[str]:
        """Arcaea wikiの楽曲一覧ページから楽曲ページのリンクを取得する

        Returns:
            list[str]: 見つかった楽曲ページへのリンク一覧
        """
        soup: BeautifulSoup = web_funks.get(WIKI_SONGLIST_URL)["soup"]
        urls: set = set()
        url_tables = soup.find_all("table")
        # すべてのテーブルに存在するリンクのうち、ページそのものへのリンクが楽曲ページへのリンク
        for url_table in url_tables:
            links = url_table.find_all("a")
            for j in links:
                if "#" not in str(j.get("href")):
                    # Arcaea wikiは相対参照でリンクを書いているので解析
                    urls.add(up.urljoin(WIKI_SONGLIST_URL, str(j.get("href"))))
        return list(urls)

    def get_update_urls() -> list[str]:
        """情報を更新すべきページの一覧を取得する

        Returns:
            list[str]: 情報を更新するべきページ
        """
        song_pages = get_song_pages()
        soup: BeautifulSoup = web_funks.get(WIKI_RECENT_UPDATE_URL)["soup"]
        urls: set = set()
        lists: list[BeautifulSoup] = soup.find("ul", class_="list1").find_all("li")
        # RecentUpdateページで追いきれないほど情報が古いとき全更新するフラグ
        all_update: bool = True
        # チェックした最終更新日
        date_num_max: int = 0
        for list_ in lists:
            try:
                # xxxx-xx-xx形式で更新日が書かれているのでintにする
                date = re.match(r"(\d{4})-(\d{2})-(\d{2})", list_.get_text())
                date_num = int(date.group(1)) * 10 ** 4 + int(date.group(2)) * 10 ** 2 + int(date.group(3))
                # Arcaea wikiは相対参照でリンクを書いているので解析
                link_url = up.urljoin(WIKI_RECENT_UPDATE_URL, str(list_.find("a").get("href")))
                if date_num >= datas["last_update"]:
                    # 最近更新があったページのうち楽曲ページが更新されているなら更新リストに入れる
                    if link_url in song_pages:
                        urls.add(link_url)
                else:
                    # チェックした最終更新より古い更新がページに残っていれば全更新しない
                    all_update = False
                date_num_max = max(date_num, date_num_max)
            except Exception:
                pass
        # チェックした最終更新日を更新
        datas["last_update"] = date_num_max
        # 全更新フラグが立っていれば全楽曲ページ、いなければ最近の更新ページのリストを返す
        if all_update:
            return song_pages
        else:
            return list(urls)

    def update(update_url: str):
        """指定したURLから楽曲情報を取得し更新する

        Args:
            update_url (str): 更新する楽曲ページのURL
        """
        try:
            soup: BeautifulSoup = web_funks.get(update_url)["soup"]
            # タイトル、英語版タイトル、ジャケットURLは取得方法が違うので先に取得
            title: str = soup.find("h2").text.strip()
            eng_title: list[re.Match] = re.findall(r"英語版タイトル「(.*?)」", str(soup))
            jacket_urls: list[str] = list(set(map(lambda x: x["src"], soup.find_all("img", loading='lazy', alt=title))))
            # 楽曲詳細のtableからデータを抜き出す
            table_rows: list[BeautifulSoup] = soup.find_all('tr')
            rows: dict = dict()
            for row in table_rows:
                try:
                    head: str = row.find('th').text
                    data: list = list(map(lambda x: x.text, row.find_all('td')))
                    rows[head] = data
                except Exception:
                    pass
            # 楽曲データが既にあるならidを取得、なければ新規に作成
            id: int = 0
            try:
                id = int(datas["musics"][title]["id"])
            except Exception:
                id = len(datas["music"]) + 1
            # 各種楽曲データを更新
            datas["musics"][title] = {
                'title': title,
                'eng_title': eng_title[0] if eng_title else title,
                'pack': rows['Pack'][0][0: -2] if rows['Pack'][0].find('*') != -1 else rows['Pack'][0],
                'composer': rows['Composer'][0],
                'level': list_to_diffdict(list(map(lambda x: x[0:-2] if x.find('*') != -1 else x, rows['Level']))),
                'notes': list_to_diffdict(list(map(int, rows['Notes']))),
                'const': list_to_diffdict(list(map(float, re.findall(r"譜面定数 : .*?(..?\..)", str(soup))))),
                'id': id
            }
            # jacket123a.pngのような形式でいったんpngを保存しhistデータで置き換える
            alp = "abcdefg"
            for i in range(len(jacket_urls)):
                file_path = f"{jackets_path}/jacket{id}{alp[i]}.png"
                web_funks.download_file(jacket_urls[i], file_path)
                to_hist.toHist(file_path)
        except Exception:
            raise

    update_urls = get_update_urls()
    for update_url in update_urls:
        try:
            update(update_url)
        except Exception:
            pass
        time.sleep(0.4)
    json_funks.set_json(data_path, datas)
