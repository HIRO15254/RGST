export interface IElectronAPI {
  sendArcaeaResult: () => Promise<void>;
  GetArcaeaResult: () => Promise<{ [key: string]: string }[]>;
}

declare global {
  interface Window {
    api: IElectronAPI;
  }
}
