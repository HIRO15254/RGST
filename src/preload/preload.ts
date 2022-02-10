import { contextBridge, ipcRenderer } from "electron";

export class ContextBridgeApi {
  public static readonly API_KEY = "api";

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public uploadArcaeaResult = async function () {
    await ipcRenderer.invoke("upload_arcaea_result");
  };
  public reinitializeArcaeaSettings = async function () {
    await ipcRenderer.invoke("reinitialize_arcaea_settings");
  };
  public getArcaeaResult = async function () {
    return await ipcRenderer.invoke("get_arcaea_result");
  };
}

contextBridge.exposeInMainWorld(ContextBridgeApi.API_KEY, new ContextBridgeApi());
