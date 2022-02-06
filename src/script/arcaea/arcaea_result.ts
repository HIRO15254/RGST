import { dialog } from "electron";
import { settings, reloadSettings } from "../settings";
import { AnalyseArcaeaResult, ArcaeaInit } from "./arcaea_python";

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
    ArcaeaInit(files.filePaths[0]);
    reloadSettings();
    if (!settings.arcaea.initialized) {
      await dialog.showMessageBox({
        message: "キャンセルしました",
        buttons: ["OK"],
      });
    }
  }

  AnalyseArcaeaResult(files.filePaths);
}
