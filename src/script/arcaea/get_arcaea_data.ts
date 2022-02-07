import SearchFiles from "../search_files";
import * as fs from "fs";

const DATA_PATH = SearchFiles(/arcaea_data.json$/)[0].dir;
let ret = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));

export default function GetArcaeaData(title: string) {
  return ret["musics"][title];
}

export function ArcaeaDataUpdate() {
  ret = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
}
