import * as fs from "fs";
import Paths from "../paths";

export type ArcaeaResultType = {
  date: string;
  filepath: string;
  title: string;
  diff: "past" | "present" | "future" | "beyond";
  score: number;
  pure: number;
  far: number;
  lost: number;
};

let _results: Array<ArcaeaResultType>;

export function getArcaeaResult() {
  _results = JSON.parse(fs.readFileSync(Paths.ARCAEA_RESULTS_PATH, "utf-8"));
  return _results;
}

export function setArcaeaResult(results: Array<ArcaeaResultType>) {
  fs.writeFileSync(Paths.ARCAEA_RESULTS_PATH, JSON.stringify(results));
}
