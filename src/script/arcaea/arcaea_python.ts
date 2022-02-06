import SearchFiles from "../search_files";
import SearchDirectries from "../search_directories";
import { PYMAIN_PATH } from "../python";
import { exec, execSync } from "child_process";
import { SETTINGS_PATH } from "../settings";

const JACKET_DIRECTORY_PATH = SearchDirectries(/arcaea_jacket$/)[0].dir;
const NUM_DIRECTRY_PATH = SearchDirectries(/arcaea_num$/)[0].dir;
const DATA_PATH = SearchFiles(/arcaea_data.json$/)[0].dir;
const RESULT_PATH = SearchFiles(/arcaea_results.json$/)[0].dir;
const GUIDE_PATH = SearchFiles(/arcaea_init_guide.png$/)[0].dir;

export function ArcaeaInit(filepath: string) {
  try {
    execSync(`${PYMAIN_PATH} arcaea_init -i ${filepath} ${GUIDE_PATH} ${SETTINGS_PATH}`);
  } catch (err) {
    console.log(err.toString());
  }
}

export async function AnalyseArcaeaResult(filepath: string[]) {
  try {
    exec(`${PYMAIN_PATH} analyse_arcaea_result -i ${SETTINGS_PATH} ${DATA_PATH} ${JACKET_DIRECTORY_PATH} ${NUM_DIRECTRY_PATH} ${RESULT_PATH} ${filepath.join(" ")}`);
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
