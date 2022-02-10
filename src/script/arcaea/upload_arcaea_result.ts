import { dialog } from "electron";
import { getSettings } from "../settings";
import { analyseArcaeaResult, initializeArcaeaSettings } from "./arcaea_python";

export default async function uploadArcaeaResult() {
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
  if (!checkInitialized()) {
    await dialog.showMessageBox({
      message: "Arcaeaのスクリーンショット解析の初期設定を行います",
      detail: "ガイド画像とあなたのリザルト画像が表示されますので、対応する位置をドラッグで選択してください。\n各ステップで、選択し終わったらエンターキーで決定してください",
      buttons: ["OK"],
    });
    initializeArcaeaSettings(files.filePaths[0]);
    if (!checkInitialized()) {
      await dialog.showMessageBox({
        message: "キャンセルしました",
        buttons: ["OK"],
      });
      return;
    }
  }

  await analyseArcaeaResult(files.filePaths);
}

function checkInitialized() {
  try {
    return getSettings().arcaea.initialized == "true";
  } catch {
    return false;
  }
}
