import * as fs from "fs";
import PATHES from "../pathes";

export default function GetArcaeaData(title: string) {
  return JSON.parse(fs.readFileSync(`${PATHES.PACKED_DATA_PATH}\\arcaea_data.json`, "utf-8"))["musics"][title];
}
