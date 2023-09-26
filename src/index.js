import { slugify } from 'transliteration';
import cherio from 'cherio';
import chalk from 'chalk';
import { PuppeteerHandler } from './helpers/puppeteer.js';
import saveData from './handlers/saver.js';
import basePathName from './helpers/url.js';


const SITE = 'https://tgstat.ru/politics'
export const p = new PuppeteerHandler();

function clearLine(str){
    return str.trim().replace(/\n/g, '').replace(/\s+/g,' ').trim()
}

async function listItemHandler(data) {
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

async function main(){
    try{
        const pageContent = await p.getPageContent(SITE)
        const $ = cherio.load(pageContent)
        const listChannel = []

        $('.text-body').each((i, header) => {
             const url = $(header).attr('href')
             let text = $(header).find('.font-16.text-dark.text-truncate').text()
             if(!text)
                text = $(header).find('.h4.text-truncate.text-dark').text()

             if(!url || !text){
                console.log(chalk.yellow('Нестандартные данные!'))
                console.log(text || 'TextEmpty', '\n', url)
                console.log('----------------')
                return
             }
             const code = slugify(text)
             listChannel.push({
                name: basePathName(url).split('@')[1] || basePathName(url),
                url,
                text,
                code: `${i+1} ${code}`
             })
        })

        await listItemHandler(listChannel)    
    } catch(err){
        console.log(chalk.red('Произошла ошибка!'))
        console.log(err)
    } finally {
        p.closeBrowser()
    }
}

main();