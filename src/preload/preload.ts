import { contextBridge, ipcRenderer } from "electron";

export class ContextBridgeApi {
  public static readonly API_KEY = "api";

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public sendOpenFile = async () => ipcRenderer.invoke("open-file");
}

contextBridge.exposeInMainWorld(ContextBridgeApi.API_KEY, new ContextBridgeApi());
