import path from "path";
import fs from "fs";
import chalk from "chalk";
import { __dirname } from "../helpers/utils.js";

export async function saveData(data) {
  const fileName = `${data.filename}.json`;

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
        chalk.blue("Файл успешно сохранен: ") + chalk.blue.bold(fileName) + "\n"
      );

      resolve();
    });
  });
}


export function streamToString(filePath) {
  const stream = fs.createReadStream(filePath, { encoding: "utf8" });
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  })
}

export async function readFile(filePath) {
  const str = await streamToString(filePath)
  return JSON.parse(str)
}
