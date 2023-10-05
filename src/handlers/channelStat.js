import cherio from "cherio";
import { clearLine, sleep } from "../helpers/utils.js";
import { p } from "../index.js";

export async function channelStat(item) {
  const url = `https://tgstat.ru/channel/${item.name}/stat`;
  const detailContent = await p.getPageContent(url);
  const $ = cherio.load(detailContent);
  const statList = [];

  const lang = clearLine($(".text-left.text-sm-right").find(".mt-4").text());
  let categ = clearLine($(".text-left.text-sm-right").find(".mt-2").text());
  let lastIndex = categ.lastIndexOf(" ");
  categ = categ.substring(0, lastIndex);

  $(".card.card-body.pt-1.pb-2.position-relative.border.min-height-155px").each(
    (i, el) => {
      statList.push({
        name: clearLine(
          $(el)
            .find(".position-absolute.text-uppercase.text-dark.font-12")
            .text()
        ),
        value: clearLine($(el).find("h2.text-dark").text()),
      });
    }
  );

  if (!statList) {
    await sleep(10000);
    await foo(item);
  }
  
  return {
    ...item,
    statistics: statList,
    lang,
    categories: categ,
  }
}
