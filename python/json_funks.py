import json

def get_json(path):
    data = dict()
    with open(path, mode='rt', encoding='utf-8') as file:
        return json.load(file)


def set_json(path, data):
    with open(path, mode='wt', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=2)