import cherio from 'cherio'
import chalk from 'chalk'
import { p } from './../index.js';
import saveData from './saver.js';

function clearLine(str){
    return str.trim().replace(/\n/g, '').replace(/\s+/g,' ').trim()
}

export default async function listItemHandler(data) {
    try{
        for(const item of data){
            const url = `https://tgstat.ru/channel/${item.name}/stat`
            const detailContent = await p.getPageContent(url)
            const $ = cherio.load(detailContent)
            const statList = []

            const lang = clearLine($('.text-left.text-sm-right').find('.mt-4').text())
            let categ = clearLine($('.text-left.text-sm-right').find('.mt-2').text())
            let lastIndex = categ.lastIndexOf(" ");
            categ = categ.substring(0, lastIndex);
            
            $('.card.card-body.pt-1.pb-2.position-relative.border.min-height-155px').each((i, el) => {
                statList.push({
                    name:  clearLine($(el).find('.position-absolute.text-uppercase.text-dark.font-12').text()),
                    value: clearLine($(el).find('h2.text-dark').text())
                })
            })

             saveData({
                ...item,
                statistics: statList,
                lang,
                categories: categ
            })
        }
    } catch (err){
        throw err
    }
}