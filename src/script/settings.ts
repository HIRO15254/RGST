import * as fs from "fs";
import PATHES from "./paths";

export function getSettings() {
  return JSON.parse(fs.readFileSync(PATHES.SETTINGS_PATH, "utf8"));
}

export function setSettings(settings: object) {
  fs.writeFileSync(PATHES.SETTINGS_PATH, JSON.stringify(settings, null, 2));
}
