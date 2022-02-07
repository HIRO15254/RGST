import argparse
from arcaea.arcaea_init import arcaea_init as init
from arcaea.arcaea_update import arcaea_updade as update
from arcaea.arcaea_result import analyse_arcaea_result as analyse


def arcaea_init(image_path: str, guide_image_path: str, settings_path: str):
    init(image_path, guide_image_path, settings_path)


def arcaea_update(data_path: str, jackets_path: str):
    update(data_path, jackets_path)


def analyse_arcaea_result(settings_path: str, data_path: str, jackets_path: str, nums_path: str, result_path: str, *image_paths: tuple[str]):
    analyse(settings_path, data_path, jackets_path, nums_path, result_path, *image_paths)


if __name__ == "__main__":
    # コマンドラインにおいて[関数名] -i [引数1] [引数2] ... のような入力を受け取れる
    parser = argparse.ArgumentParser()
    parser.add_argument('function_name', type=str, help='set fuction name in this file')
    parser.add_argument('-i', '--func_args', nargs='*', help='args in function', default=[])
    args = parser.parse_args()

    # このファイル内の関数を取得
    func_dict = {k: v for k, v in locals().items() if callable(v)}
    # 引数のうち，数値として解釈できる要素はfloatにcastする
    func_args = [float(x) if x.isnumeric() else x for x in args.func_args]
    # 関数実行
    ret = func_dict[args.function_name](*func_args)
