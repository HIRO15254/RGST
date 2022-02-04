import { dialog } from "electron";
import { settings, settingsPath, reloadSettings } from "../settings";
import SearchFiles from "../search_files";
import { execSync } from "child_process";
import SearchDirectries from "../search_directories";

export default async function ArcaeaResult() {
  const files = await dialog.showOpenDialog({
    properties: ["openFile", "multiSelections"],
    title: "ファイルを選択する",
    filters: [
      {
        name: "画像ファイル",
        extensions: ["png", "jpeg", "jpg"],
      },
    ],
  });

  if (files.filePaths.length == 0) return;
  if (!settings.arcaea.initialized) {
    await dialog.showMessageBox({
      message: "Arcaeaのスクリーンショット解析の初期設定を行います",
      detail: "ガイド画像とあなたのリザルト画像が表示されますので、対応する位置をドラッグで選択してください。\n各ステップで、選択し終わったらエンターキーで決定してください",
      buttons: ["OK"],
    });
    const guidePicPath = SearchFiles("./", /arcaea_init_guide.png$/)[0].dir;
    const pyexePath = SearchFiles("./", /pymain.exe$/)[0].dir;
    try {
      execSync(`${pyexePath} arcaea_init -i ${files.filePaths[0]} ${guidePicPath} ${settingsPath}`);
    } catch (err) {
      console.log(err.toString());
    }
    reloadSettings();
    if (!settings.arcaea.initialized) {
      await dialog.showMessageBox({
        message: "キャンセルしました",
        buttons: ["OK"],
      });
    }
  }

  for (const file of files.filePaths) {
    try {
      const pyexePath = SearchFiles("./", /pymain.exe$/)[0].dir;
      const settingsPath = SearchFiles("./", /rgstsettings.json$/)[0].dir;
      const jacketPath = SearchDirectries("./", /arcaea_jacket$/)[0].dir;
      const dataPath = SearchFiles("./", /arcaea_data.json$/)[0].dir;
      const numPath = SearchDirectries("./", /arcaea_num$/)[0].dir;
      const resultPath = SearchFiles("./", /arcaea_results.json$/)[0].dir;
      execSync(`${pyexePath} analyse_arcaea_result -i ${file} ${settingsPath} ${jacketPath} ${dataPath} ${numPath} ${resultPath}`);
    } catch (err) {
      console.log(err.toString());
      console.log(`ファイル${file}を正常に読み込めませんでした。`);
    }
  }
}
