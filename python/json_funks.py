import json


def get(path: str) -> dict:
    """jsonファイルを読み込んでdictとして返します

    Args:
        path (str): 読み込むjsonファイルのパス

    Returns:
        dict: jsonファイルの内容
    """
    with open(path, mode='rt', encoding='utf-8') as file:
        return json.load(file)


def set(path: str, data: dict):
    """受け取ったdictをjsonファイルに書き込みます

    Args:
        path (str): 書き込むjsonファイルのパス
        data (dict): jsonファイルに書き込む内容
    """
    with open(path, mode='wt', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=2)


def update(path: str, data: dict):
    """受け取ったdictでjsonファイルを更新します(同じキーは上書き、違うキーは追加)

    Args:
        path (str): 更新するjsonファイルのパス
        data (dict): jsonファイルの更新内容
    """
    read_data: dict = dict()
    with open(path, mode='rt', encoding='utf-8') as file:
        read_data = json.load(file)
    read_data.update(data)
    with open(path, mode='wt', encoding='utf-8') as file:
        json.dump(read_data, file, ensure_ascii=False, indent=2)
