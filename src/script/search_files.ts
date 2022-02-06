import * as fs from "fs";
import * as path from "path";

function SearchFiles(query: RegExp | string, dirPath?: string): Array<{ dir: string; name: string }> {
  if (typeof query == "string") {
    query = RegExp(query);
  }
  if (typeof dirPath == "undefined") {
    dirPath = "./";
  }
  const allDirents = fs.readdirSync(dirPath, { withFileTypes: true });

  const files = [];
  for (const dirent of allDirents) {
    if (dirent.isDirectory()) {
      const fp = path.join(dirPath, dirent.name);
      files.push(SearchFiles(query, fp));
    } else if (dirent.isFile() && query.test(dirent.name)) {
      files.push({
        dir: path.resolve(path.join(dirPath, dirent.name)),
        name: dirent.name,
      });
    }
  }
  return files.flat();
}

export default SearchFiles;
