import * as fs from "fs";
import * as path from "path";

function searchDirectries(query: RegExp | string, dirPath?: string): Array<{ dir: string; name: string }> {
  if (typeof query == "string") {
    query = RegExp(query);
  }
  if (typeof dirPath == "undefined") {
    dirPath = "./";
  }
  const allDirents = fs.readdirSync(dirPath, { withFileTypes: true });

  const directries = [];
  for (const dirent of allDirents) {
    if (dirent.isDirectory()) {
      const fp = path.join(dirPath, dirent.name);
      directries.push(searchDirectries(query, fp));
      if (query.test(fp)) {
        directries.push({
          dir: path.resolve(path.join(dirPath, dirent.name)),
          name: dirent.name,
        });
      }
    }
  }
  return directries.flat();
}

export default searchDirectries;
