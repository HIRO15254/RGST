import * as fs from "fs";
import * as path from "path";

function SearchDirectries(dirPath: string, query: RegExp): Array<{ dir: string; name: string }> {
  const allDirents = fs.readdirSync(dirPath, { withFileTypes: true });

  const directries = [];
  for (const dirent of allDirents) {
    if (dirent.isDirectory()) {
      const fp = path.join(dirPath, dirent.name);
      directries.push(SearchDirectries(fp, query));
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

export default SearchDirectries;
