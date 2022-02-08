import { dialog } from "electron";
import { getSettings } from "../settings";
import { ArcaeaInit } from "./arcaea_python";

export default async function ArcaeaReInitialize() {
  const files = await dialog.showOpenDialog({
    properties: ["openFile"],
    title: "ファイルを選択する",
    filters: [
      {
        name: "画像ファイル",
        extensions: ["png", "jpeg", "jpg"],
      },
    ],
  });
  if (files.filePaths.length == 0) return;
  await dialog.showMessageBox({
    message: "Arcaeaのスクリーンショット解析の再設定を行います",
    detail: "ガイド画像とあなたのリザルト画像が表示されますので、対応する位置をドラッグで選択してください。\n各ステップで、選択し終わったらエンターキーで決定してください",
    buttons: ["OK"],
  });
  ArcaeaInit(files.filePaths[0]);
}
