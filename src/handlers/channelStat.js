import cherio from "cherio";
import { clearLine, isPrivate, randomFromInterval, sleep } from "../helpers/utils.js";
import { p } from "../index.js";

export async function channelStat(item) {
  const detailContent = await p.getPageContent(item.urlstat);
  const $ = cherio.load(detailContent);
  const statList = [];

  const lang = clearLine($(".text-left.text-sm-right").find(".mt-4").text());
    
  let categ = clearLine($(".text-left.text-sm-right").find(".mt-2").text());

  let isClose = isPrivate(clearLine($(".btn.btn-outline-info.btn-rounded.px-3.py-05.font-14.mr-1.mb-15").text()))

  let lastIndex = categ.lastIndexOf(" ");
  categ = categ.substring(0, lastIndex);

  $(".card.card-body.pt-1.pb-2.position-relative.border.min-height-155px").each(
    (i, el) => {
      statList.push({
        name: clearLine(
          $(el).find(".position-absolute.text-uppercase.text-dark.font-12").text()),
        value: clearLine($(el).find("h2.text-dark").text()),
      });
    }
  );

  // if (!statList) {
  //   console.log('stat ', statList)
  //   await sleep(randomFromInterval(3400, 6800));
  //   await channelStat(item);
  // }

  return {
    channelId: item._id,
    isPrivate: isClose,
    lang,
    categories: categ,
    statistics: statList,
  }
}
