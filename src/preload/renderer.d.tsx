import { ArcaeaResultType } from "../script/arcaea/arcaea_result";
export interface IElectronAPI {
  uploadArcaeaResult: () => Promise<void>;
  reinitializeArcaeaSettings: () => Promise<void>;
  setArcaeaResult: (results: Array<ArcaeaResultType>) => Promise<void>;
  getArcaeaResult: () => Promise<Array<ArcaeaResultType>>;
}

declare global {
  interface Window {
    api: IElectronAPI;
  }
}
