import PATHES from "./script/pathes";
import * as fs from "fs";
import { ArcaeaUpdate } from "./script/arcaea/arcaea_python";

export default function init() {
  if (!fs.existsSync(PATHES.SETTINGS_PATH)) {
    fs.writeFileSync(PATHES.SETTINGS_PATH, "{}");
  }
  if (!fs.existsSync(PATHES.ARCAEA_RESULTS_PATH)) {
    fs.writeFileSync(PATHES.ARCAEA_RESULTS_PATH, "{}");
  }
  ArcaeaUpdate();
}
