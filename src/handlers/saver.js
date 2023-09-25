import path from "path";
import fs from "fs";
import chalk from "chalk";
import { __dirname } from "../helpers/url.js";

export default async function saveData(data) {
  const { code } = data;
  const fileName = `${code}.json`;

  const baseDir = path.join(__dirname, "..", "..", "data");
  fs.access(baseDir, function (err) {
    if (err && err.code === "ENOENT") {
      fs.mkdir(baseDir); //Create dir in case not found
    }
  });

  const savePath = path.join(baseDir, fileName);

  return new Promise((resolve, reject) => {
    fs.writeFile(savePath, JSON.stringify(data, null, 4), (err) => {
      if (err) {
        return reject(err);
      }

      console.log(
        chalk.blue("File was saved successfully: ") +
          chalk.blue.bold(fileName) +
          "\n"
      );

      resolve();
    });
  });
}
