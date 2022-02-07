import * as fs from "fs";
import PATHES from "../pathes";

export default function GetArcaeaResult() {
  const ret: { [key: string]: string }[] = [];
  const raw: { [key: string]: { [key: string]: string } } = JSON.parse(fs.readFileSync(PATHES.ARCAEA_RESULTS_PATH, "utf-8"));
  for (const key in raw) {
    ret.push(raw[key]);
  }
  return ret;
}
