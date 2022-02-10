import { exec, execSync } from "child_process";
import Paths from "../paths";

const JACKET_DIRECTORY_PATH = `${Paths.PACKED_DATA_PATH}\\arcaea_jacket`;
const NUM_DIRECTRY_PATH = `${Paths.PACKED_DATA_PATH}\\arcaea_num`;
const DATA_PATH = `${Paths.PACKED_DATA_PATH}\\arcaea_data.json`;
const GUIDE_PATH = `${Paths.PACKED_DATA_PATH}\\arcaea_init_guide.png`;
const PYMAIN_PATH = Paths.PYMAIN_PATH;
const SETTINGS_PATH = Paths.SETTINGS_PATH;
const RESULTS_PATH = Paths.ARCAEA_RESULTS_PATH;

export function initializeArcaeaSettings(filepath: string) {
  try {
    execSync(`${PYMAIN_PATH} arcaea_init -i ${filepath} ${GUIDE_PATH} ${SETTINGS_PATH}`);
  } catch (err) {
    console.log(err.toString());
  }
}

export async function analyseArcaeaResult(filepath: string[]) {
  try {
    execSync(`${PYMAIN_PATH} analyse_arcaea_result -i ${SETTINGS_PATH} ${DATA_PATH} ${JACKET_DIRECTORY_PATH} ${NUM_DIRECTRY_PATH} ${RESULTS_PATH} ${filepath.join(" ")}`);
  } catch (err) {
    console.log(err.toString());
    console.log(`Arcaeaのリザルトを正常に読み込めませんでした。`);
  }
}

export async function updateArcaeaData() {
  console.log("arcaea update is started");
  try {
    exec(`${PYMAIN_PATH} arcaea_update -i ${DATA_PATH} ${JACKET_DIRECTORY_PATH}`);
  } catch (err) {
    console.log(err.toString());
  }
}
