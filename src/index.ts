import { app, BrowserWindow, autoUpdater, dialog, ipcMain } from "electron";
import { execSync } from "child_process";

// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string; //レンダラープロセススクリプトのファイルパス
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string; //preloadスクリプトのファイルパス

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", function () {
  try {
    const ret = execSync("py --list-paths");
    console.log(/.:.*?python.exe/.exec(ret.toString()));
  } catch {
    dialog.showMessageBox({
      message: "Pythonがインストールされていません",
      detail: "https://www.python.org/downloads/ \nから最新版をインストールしてください。\nその後、PCの再起動をお勧めします。",
    });
  }
  try {
    execSync("python -m pip install opencv-python opencv-contrib-python numpy");
  } catch {
    dialog.showMessageBox({
      message: "必要なライブラリをPythonにインストールできませんでした。",
      detail: "PCの再起動や最新版の再インストールをお勧めします。",
    });
  }
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// ファイルの末尾に追加
const server = "https://update.electronjs.org";
const feed = `${server}/HIRO15254/RGST/${process.platform}-${process.arch}/${app.getVersion()}`;

if (app.isPackaged) {
  // パッケージされている（ローカル実行ではない）
  autoUpdater.setFeedURL({
    url: feed,
  });
  autoUpdater.checkForUpdates(); // アップデートを確認する

  // アップデートのダウンロードが完了したとき
  autoUpdater.on("update-downloaded", async () => {
    const returnValue = await dialog.showMessageBox({
      message: "アップデートあり",
      detail: "再起動してインストールできます。",
      buttons: ["再起動", "後で"],
    });
    if (returnValue.response === 0) {
      autoUpdater.quitAndInstall(); // アプリを終了してインストール
    }
  });

  // アップデートがあるとき
  autoUpdater.on("update-available", () => {
    dialog.showMessageBox({
      message: "アップデートがあります",
      buttons: ["OK"],
    });
  });

  // アップデートがないとき
  autoUpdater.on("update-not-available", () => {
    dialog.showMessageBox({
      message: "アップデートはありません",
      buttons: ["OK"],
    });
  });

  // エラーが発生したとき
  autoUpdater.on("error", () => {
    dialog.showMessageBox({
      message: "アップデートエラーが起きました",
      buttons: ["OK"],
    });
  });
}

ipcMain.handle("open-file", async () => {
  return await dialog
    .showOpenDialog({
      properties: ["openFile"],
      title: "ファイルを選択する",
      filters: [
        {
          name: "画像ファイル",
          extensions: ["png", "jpeg", "jpg"],
        },
      ],
    })
    .then((result) => {
      if (result.canceled) return;
      return result.filePaths[0];
    })
    .catch((err) => console.log(`Error: ${err}`));
});
