import SearchFiles from "../search_files";
import * as fs from "fs";
import GetArcaeaData from "./get_arcaea_data";

const RESULT_PATH = SearchFiles(/arcaea_results.json$/)[0].dir;

export default function GetArcaeaResult() {
  const ret: { [key: string]: string }[] = [];
  const raw: { [key: string]: { [key: string]: string } } = JSON.parse(fs.readFileSync(RESULT_PATH, "utf-8"));
  for (const key in raw) {
    raw[key]["right"] = parseInt(raw[key]["pure"]) + parseInt(raw[key]["far"]) + parseInt(raw[key]["lost"]) == GetArcaeaData(raw[key]["title"])["notes"][raw[key]["diff"]] ? "true" : "false";
    ret.push(raw[key]);
  }
  return ret;
}
