import { slugify } from "transliteration";
import cherio from "cherio";
import chalk from "chalk";
import {
  basePathName,
  clearChanelName,
  clearLine,
  sleep,
  subInt,
} from "../helpers/utils.js";
import { p } from "../index.js";

export async function generalAnalysis(url) {
  await p.initBrowser(url);
  console.log("Считаем количество каналов ...");
  while (true) {
    const t = await p.page.$(
      ".btn.btn-light.border.lm-button.py-1.min-width-220px"
    );
    let isVis = await t.isVisible();
    if (!isVis) break;
    await t.click();
    await sleep(3000);
  }
  const pageContent = await p.page.content();
  const $ = cherio.load(pageContent);

  const listChannel = [];

  console.log(`Всего каналов: ${$(".text-body").length}`);
  console.log("-----------------\n");
  console.log("Идет парсинг ...");

  $(".text-body").each((i, header) => {
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

    const code = slugify(nameru);
    listChannel.push({
      namechanel: clearChanelName(basePathName(url)),
      urlstat: url,
      nameru,
      description,
      subscribers,
      lastpublish,
      filename: `${i + 1} ${code}`,
    });
  });

  return listChannel;
}
