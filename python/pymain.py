import argparse

from numpy import save
import arcaea.arcaea_init
import arcaea.arcaea_update
import arcaea.arcaea_result

def arcaea_init(imgpath, guidepath, settingpath):
    arcaea.arcaea_init.arcaea_init(imgpath, guidepath, settingpath)

def arcaea_update(datapath, savepath):
    arcaea.arcaea_update.ArcaeaUpdade(datapath, savepath)

def analyse_arcaea_result(imagepath, settingspath, jacketpath, datapath, numpath, resultjsonpath):
    arcaea.arcaea_result.analyseArcaeaResult(imagepath, settingspath, jacketpath, datapath, numpath, resultjsonpath)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('function_name',
                        type=str,
                        help='set fuction name in this file')
    parser.add_argument('-i', '--func_args',
                        nargs='*',
                        help='args in function',
                        default=[])
    args = parser.parse_args()

    # このファイル内の関数を取得
    func_dict = {k: v for k, v in locals().items() if callable(v)}
    # 引数のうち，数値として解釈できる要素はfloatにcastする
    func_args = [float(x) if x.isnumeric() else x for x in args.func_args]
    # 関数実行
    ret = func_dict[args.function_name](*func_args)
