import urllib.parse as up
import re
from os import path
import web_funks as wf
import json_funks
import time

def ArcaeaUpdade(datapath, savepath):
    datas = json_funks.get_json(datapath)

    def ListToArcData(list):
        ret = dict()
        diffs = ["past", "present", "future", "beyond"]
        for i in range(4):
            if len(list) > i:
                ret[diffs[i]] = list[i]
        return ret

    def getLinks():
        url = "https://wikiwiki.jp/arcaea/%E3%83%91%E3%83%83%E3%82%AF%E9%A0%86"
        soup = wf.get_as(url)["soup"]
        urls = set()
        url_tables = soup.find_all("table")
        for i in url_tables:
            links = i.find_all("a")
            for j in links:
                if "#" not in str(j.get("href")):
                    urls.add(up.urljoin(url, str(j.get("href"))))
        return list(urls)

    def getRecentUpdate(musicpages):
        url = "https://wikiwiki.jp/arcaea/RecentChanges"
        soup = wf.get_as(url)["soup"]
        urls = set()
        links = soup.find("ul", class_="list1").find_all("li")
        all_update = True
        update_max = 0
        for link in links:
            date = re.match(r"(\d{4})-(\d{2})-(\d{2})", link.get_text())
            date_num = int(date.group(1)) * 10 ** 4 + int(date.group(2)) * 10 ** 2 + int(date.group(3))
            link_url = up.urljoin(url, str(link.find("a").get("href")))
            if date_num > datas["last_update"]:
                if link_url in musicpages:
                    urls.add(link_url)
            else:
                all_update = False
            update_max = max(date_num, update_max)
        datas["last_update"] = update_max
        if all_update:
            return musicpages
        else:
            return list(urls)

    def update(updateurl, savepath):
        try:
            soup = wf.get_as(updateurl)["soup"]
            title = soup.find("h2").text.strip()
            eng_title = re.findall(r"英語版タイトル「(.*?)」", str(soup))
            jacket_urls = soup.find_all("img", width=300, height=300, loading='lazy')
            jacket_urls = jacket_urls + soup.find_all("img", width=320, height=320, loading='lazy')
            jacket_urls = jacket_urls + soup.find_all("img", width=215, height=215, loading='lazy')
            jacket_urls = list(set(list(map(lambda x: x["src"], jacket_urls))))
            tr = soup.find_all('tr')
            rows = dict()
            for row in tr:
                try:
                    head = row.find('th').text
                    data = list(map(lambda x: x.text, row.find_all('td')))
                    rows[head] = data
                except Exception:
                    pass
            id = 0
            try:
                id = datas[title]["id"]
            except:
                id = datas["max_id"] + 1
                datas["max_id"] += 1
            datas[title] = {
                'title': title,
                'eng_title': eng_title[0] if eng_title else title,
                'pack': rows['Pack'][0][0: -2] if rows['Pack'][0].find('*') != -1 else rows['Pack'][0],
                'composer': rows['Composer'][0],
                'level': ListToArcData(list(map(lambda x: x[0:-2] if x.find('*') != -1 else x, rows['Level']))),
                'notes': ListToArcData(list(map(int, rows['Notes']))),
                'const': ListToArcData(list(map(float, re.findall(r"譜面定数 : .*?(..?\..)", str(soup))))),
                'id': id
            }

            for i in range(len(jacket_urls)):
                print(jacket_urls[i])
                wf.download_file(jacket_urls[i], f"{savepath}/jacket_{id}{'_' + str(i) if i != 0 else ''}.png")
        except Exception:
            return None

    musicpages = getLinks()
    updateurls = getRecentUpdate(musicpages)
    for i in updateurls:
        update(i, savepath)
        json_funks.set_json(datapath, datas)
        time.sleep(0.8)
