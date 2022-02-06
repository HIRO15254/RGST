import SearchFiles from "../script/search_files";

export const PYMAIN_PATH = SearchFiles(/pymain\.exe/)[0].dir;
