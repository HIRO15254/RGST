export interface IElectronAPI {
  sendArcaeaResult: () => Promise<void>;
}

declare global {
  interface Window {
    api: IElectronAPI;
  }
}
