import * as fs from "fs";
import Paths from "../paths";

export type ArcaeaDataType = {
  title: string;
  eng_title: string;
  pack: string;
  composer: string;
  level: {
    past: string;
    present: string;
    future: string;
    beyond: string;
  };
  notes: {
    past: number;
    present: number;
    future: number;
    beyond: number;
  };
  const: {
    past: number;
    present: number;
    future: number;
    beyond: number;
  };
  id: number;
};

let _data: Array<ArcaeaDataType>;

export function getArcaeaData(): Array<ArcaeaDataType> {
  _data = JSON.parse(fs.readFileSync(`${Paths.PACKED_DATA_PATH}\\arcaea_data.json`, "utf-8"))["songs"];
  return _data;
}

export function setArcaeaData(data: Array<ArcaeaDataType>) {
  _data = data;
}
