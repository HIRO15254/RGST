import { contextBridge, ipcRenderer } from "electron";
import { ArcaeaResultType } from "../script/arcaea/arcaea_result";

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
  public setArcaeaResult = async function (results: Array<ArcaeaResultType>) {
    await ipcRenderer.invoke("set_arcaea_result", results);
  };
}

contextBridge.exposeInMainWorld(ContextBridgeApi.API_KEY, new ContextBridgeApi());
