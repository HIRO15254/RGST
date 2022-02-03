import searchFiles from "./search_files";
import * as fs from "fs";

export const settingsPath = searchFiles("./", /rgstsettings.json$/)[0].dir;
export let settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
export function saveSettings(settings: object) {
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}
export function reloadSettings() {
  settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
}
