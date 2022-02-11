import { ArcaeaDataType } from "../script/arcaea/arcaea_data";
import { ArcaeaResultType } from "../script/arcaea/arcaea_result";
export interface IElectronAPI {
  uploadArcaeaResult: () => Promise<void>;
  reinitializeArcaeaSettings: () => Promise<void>;
  setArcaeaResult: (results: Array<ArcaeaResultType>) => Promise<void>;
  getArcaeaResult: () => Promise<Array<ArcaeaResultType>>;
  getArcaeaData: () => Promise<Array<ArcaeaDataType>>;
}

declare global {
  interface Window {
    api: IElectronAPI;
  }
}
