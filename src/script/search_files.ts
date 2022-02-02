import * as fs from "fs";
import * as path from "path";

function searchFiles(dirPath: string, query: RegExp): Array<{ dir: string; name: string }> {
  const allDirents = fs.readdirSync(dirPath, { withFileTypes: true });

  const files = [];
  for (const dirent of allDirents) {
    if (dirent.isDirectory()) {
      const fp = path.join(dirPath, dirent.name);
      files.push(searchFiles(fp, query));
    } else if (dirent.isFile() && query.test(dirent.name)) {
      files.push({
        dir: path.resolve(path.join(dirPath, dirent.name)),
        name: dirent.name,
      });
    }
  }
  return files.flat();
}

export default searchFiles;
