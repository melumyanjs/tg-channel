import chalk from "chalk";
import path from "path"
import { PuppeteerHandler } from "./helpers/puppeteer.js";
import { __dirname, randomFromInterval, sleep } from "./helpers/utils.js";
import { channelStat } from "./handlers/channelStat.js";
import { generalAnalysis } from "./handlers/generalAnalysis.js";
import MongoDB from "./handlers/mongomanager.js";
import cliProgress from 'cli-progress'
const baseDir = path.join(__dirname, "..", "..", "data");

export const p = new PuppeteerHandler();

export const multibar = new cliProgress.MultiBar({
  clearOnComplete: false,
  hideCursor: true,
}, cliProgress.Presets.shades_grey);

// ссылки на категории сайтов
const arraySite = ["https://tgstat.ru/politics", "https://tgstat.ru/shock"];

export const db = new MongoDB('mongodb://localhost:27017', 'tg-stat');

async function expandStat(data) {
  try {
    const statArray = [];
    for (const [index, item] of data.entries()) {
      console.log(index);
      // if (index === 10) return statArray;

      const stat = await channelStat(item);
      statArray.push(stat);
      await sleep(randomFromInterval(3400, 6800));
    }
    return statArray;
  } catch (err) {
    throw err;
  }
}

async function main() {
  const startTime = new Date(); 
  try { 
    await db.connect()

    // const b1 = multibar.create(arraySite.length, 0);
    // // Базовая инф. о канале при необходимости раскомментировать
    // for (let [index, site] of arraySite.entries()) {
    //   await generalAnalysis(site);
    //   await sleep(2000)
    //   b1.increment();
    //   b1.update(index+1)
    // }
    // multibar.stop();

    const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    console.log("Парсинг статистики")
    const listChannel = await db.aggregate('channels', 
    [{ $lookup: { from: "channelStatistics", localField: "_id", foreignField: "channelId", as: "stat"} },
    { $match: { stat: [] } }])
    bar1.start(listChannel.length, 0);

    for (const [key, item] of listChannel.entries()) {
      const stat = await channelStat(item);
      if(!stat.statistics) continue

      await db.insert('channelStatistics', stat)
      await sleep(randomFromInterval(3400, 6800));

      bar1.increment();
      bar1.update(key+1);
    }
    bar1.stop();
   
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
    await db.disconnect()
    p.closeBrowser();
  }
}

main();
