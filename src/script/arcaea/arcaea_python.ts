import { exec, execSync } from "child_process";
import PATHES from "../pathes";

const JACKET_DIRECTORY_PATH = `${PATHES.PACKED_DATA_PATH}\\arcaea_jacket`;
const NUM_DIRECTRY_PATH = `${PATHES.PACKED_DATA_PATH}\\arcaea_num`;
const DATA_PATH = `${PATHES.PACKED_DATA_PATH}\\arcaea_data.json`;
const GUIDE_PATH = `${PATHES.PACKED_DATA_PATH}\\arcaea_init_guide.png`;
const PYMAIN_PATH = PATHES.PYMAIN_PATH;
const SETTINGS_PATH = PATHES.SETTINGS_PATH;
const RESULTS_PATH = PATHES.ARCAEA_RESULTS_PATH;

export function ArcaeaInit(filepath: string) {
  try {
    execSync(`${PYMAIN_PATH} arcaea_init -i ${filepath} ${GUIDE_PATH} ${SETTINGS_PATH}`);
  } catch (err) {
    console.log(err.toString());
  }
}

export async function AnalyseArcaeaResult(filepath: string[]) {
  try {
    execSync(`${PYMAIN_PATH} analyse_arcaea_result -i ${SETTINGS_PATH} ${DATA_PATH} ${JACKET_DIRECTORY_PATH} ${NUM_DIRECTRY_PATH} ${RESULTS_PATH} ${filepath.join(" ")}`);
  } catch (err) {
    console.log(err.toString());
    console.log(`Arcaeaのリザルトを正常に読み込めませんでした。`);
  }
}

export async function ArcaeaUpdate() {
  console.log("arcaea update is started");
  try {
    exec(`${PYMAIN_PATH} arcaea_update -i ${DATA_PATH} ${JACKET_DIRECTORY_PATH}`);
  } catch (err) {
    console.log(err.toString());
  }
}
