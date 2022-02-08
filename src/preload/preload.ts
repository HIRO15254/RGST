import { contextBridge, ipcRenderer } from "electron";

export class ContextBridgeApi {
  public static readonly API_KEY = "api";

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public sendArcaeaResult = async function () {
    await ipcRenderer.invoke("arcaea_result");
  };
  public ArcaeaReInitialize = async function () {
    await ipcRenderer.invoke("arcaea_reinitialize");
  };
  public GetArcaeaResult = async function () {
    return await ipcRenderer.invoke("get_arcaea_result");
  };
}

contextBridge.exposeInMainWorld(ContextBridgeApi.API_KEY, new ContextBridgeApi());
