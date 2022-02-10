import PATHES from "./script/paths";
import * as fs from "fs";
import { updateArcaeaData } from "./script/arcaea/arcaea_python";

export default function init() {
  if (!fs.existsSync(PATHES.SETTINGS_PATH)) {
    fs.writeFileSync(PATHES.SETTINGS_PATH, "{}");
  }
  if (!fs.existsSync(PATHES.ARCAEA_RESULTS_PATH)) {
    fs.writeFileSync(PATHES.ARCAEA_RESULTS_PATH, "{}");
  }
  updateArcaeaData();
}
