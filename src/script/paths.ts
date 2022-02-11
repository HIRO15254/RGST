import { app } from "electron";
import SearchFiles from "./search_files";
import SearchDirectries from "./search_directories";

export default class Paths {
  static readonly ARCAEA_RESULTS_PATH = `${app.getPath("userData")}\\arcaea_results.json`;
  static readonly SETTINGS_PATH = `${app.getPath("userData")}\\rgstsettings.json`;
  static readonly PYMAIN_PATH = SearchFiles(/pymain\.exe$/)[0].dir;
  static readonly PACKED_DATA_PATH = SearchDirectries(/packed_data$/)[0].dir;
}
