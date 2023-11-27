import ora from 'ora';
import { slugify } from "transliteration";
import cherio from "cherio";
import chalk from "chalk";
import {
  basePathName,
  clearChanelName,
  clearLine,
  randomFromInterval,
  sleep,
  subInt,
} from "../helpers/utils.js";
import { db, multibar, p } from "../index.js";

const spinner = ora('Начинаем считать каналы')

export async function generalAnalysis(url) {
  const category = slugify(`${basePathName(url)}`)
  await p.gotoPage(url);
  console.log(`Анализ каналов из категории: ${category}`)

  spinner.start()
  while (true) {
    const t = await p.page.$(
      ".btn.btn-light.border.lm-button.py-1.min-width-220px"
    );
    let isVis = await t.isVisible();
    if (!isVis) break;
    await t.click();
    await sleep(randomFromInterval(3400, 6800));
  }
  
  const pageContent = await p.page.content();
  await parseGeneralContent(pageContent, category)
}



async function parseGeneralContent(pageContent, category){
  const $ = cherio.load(pageContent);
  const countChannel = $(".text-body").length
  spinner.text(`Всего каналов: ${countChannel}`)
  spinner.stop()
  
  console.log("-----------------\n");
  console.log("Парсинг ...");

  const b2 = multibar.create(countChannel, 0);
  $(".text-body").each(async (i, header) => {
    const url = $(header).attr("href");
    let nameru = $(header).find(".font-16.text-dark.text-truncate").text();
    if (!nameru) nameru = $(header).find(".h4.text-truncate.text-dark").text();

    if (!url || !nameru) {
      console.log(chalk.yellow("Нестандартные данные!"));
      console.log(nameru || "TextEmpty", "\n", url);
      console.log("----------------");
      return;
    }

    const subscribers = subInt(
      clearLine($(header).find(".font-12.text-truncate").text())
    );
    const description = clearLine(
      $(header).find(".font-14.text-muted.line-clamp-2.mt-1").text()
    );
    const lastpublish = clearLine(
      $(header).find(".text-center.text-muted.font-12").text()
    );

    await db.insert('channels', {
      namechanel: clearChanelName(basePathName(url)),
      category,
      urlstat: url + '/stat',
      nameru,
      description,
      subscribers,
      lastpublish,
      dateparse: new Date().toISOString()
    });

    b2.increment()
    b2.update(i+1)
  });
}