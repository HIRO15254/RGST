export interface IElectronAPI {
  sendOpenFile: () => Promise<void>;
}

declare global {
  interface Window {
    api: IElectronAPI;
  }
}
