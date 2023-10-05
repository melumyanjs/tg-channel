import { slugify } from "transliteration";
import path from "path";
import chalk from "chalk";
import { PuppeteerHandler } from "./helpers/puppeteer.js";
import {
  __dirname,
  basePathName,
  sleep,
} from "./helpers/utils.js";
import {readFile, saveData } from "./handlers/fileManager.js";
import { channelStat } from "./handlers/channelStat.js";
import { generalAnalysis } from "./handlers/generalAnalysis.js";

export const p = new PuppeteerHandler()

async function listItemHandler(data) {
  try {
    for (const [index, item] of data) {
      const stat = await channelStat(item);
      await saveData(stat)
      await sleep(3000);
    }
  } catch (err) {
    throw err;
  }
}

async function main() {
  const startTime = new Date();
  const arraySite = ["https://tgstat.ru/shock", "https://tgstat.ru/politics"];
  const listChannel =  await readFile(path.join(__dirname, "..", "..", "data", "shock.json"))
  
  try {
    // const listChannel = generalAnalysis(arraySite[0]);
    // await saveData({
    //   listChannel,
    //   filename: slugify(`${basePathName(p.page.url())}`),
    //   length: data.length,
    //   dateparse: new Date().toISOString(),
    // });

    
    console.log(listChannel)
    // await listItemHandler(listChannel)
  } catch (err) {
    console.log(chalk.red("Произошла ошибка!"));
    console.log(err);
  } finally {
    const endTime = new Date();
    console.log(
      chalk.green.bold(
        `Общее время парсинга [${(endTime - startTime) / 1000}s]\n`
      )
    );
    // p.closeBrowser()
  }
}

main();
