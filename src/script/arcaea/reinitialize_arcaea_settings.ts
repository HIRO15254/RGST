import { dialog } from "electron";
import { initializeArcaeaSettings } from "./arcaea_python";

export default async function reinitializeArcaeaSettings() {
  await dialog.showMessageBox({
    message: "Arcaeaのスクリーンショット解析の再設定を行います",
    detail: "再設定に使用する画像を選択してください。\n画像が表示されるので、ガイド画像に従って対応する位置をドラッグで選択してください。\n各ステップで、選択し終わったらエンターキーで決定してください",
    buttons: ["OK"],
  });
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
  initializeArcaeaSettings(files.filePaths[0]);
}
