import searchFiles from "./search_files";
import * as fs from "fs";

export const SETTINGS_PATH = searchFiles(/rgstsettings.json$/)[0].dir;
export let settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8"));
export function saveSettings(settings: object) {
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
}
export function reloadSettings() {
  settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8"));
}
