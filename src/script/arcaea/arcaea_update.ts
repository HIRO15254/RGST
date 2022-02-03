import SearchFiles from "../search_files";
import { exec } from "child_process";
import SearchDirectries from "../search_directories";

export default async function ArcaeaUpdate() {
  const jsonPath = SearchFiles("./", /arcaea_data.json$/)[0].dir;
  const pyexePath = SearchFiles("./", /pymain.exe$/)[0].dir;
  const jacketPath = SearchDirectries("./", /arcaea_jacket$/)[0].dir;
  console.log(jacketPath);
  try {
    exec(`${pyexePath} arcaea_update -i ${jsonPath} ${jacketPath}`);
  } catch (err) {
    console.log(err.toString());
  }
}
