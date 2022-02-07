import * as fs from "fs";
import PATHES from "./pathes";

export function setSettings(settings: object) {
  fs.writeFileSync(PATHES.SETTINGS_PATH, JSON.stringify(settings, null, 2));
}

export function getSettings() {
  return JSON.parse(fs.readFileSync(PATHES.SETTINGS_PATH, "utf8"));
}
