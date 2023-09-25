import { slugify } from 'transliteration';
import cherio from 'cherio';
import chalk from 'chalk';
import { PuppeteerHandler } from './helpers/puppeteer.js';
import saveData from './handlers/saver.js';
import basePathName from './helpers/url.js';


const SITE = 'https://tgstat.ru/politics'
const p = new PuppeteerHandler();

async function main(){
    try{
        const pageContent = await p.getPageContent(SITE)
        const $ = cherio.load(pageContent)

        $('.text-body').each((i, header) => {
             const url = $(header).attr('href')
             const text = $(header).find('.font-16.text-dark.text-truncate').text()
            
             saveData({
                name: basePathName(url),
                code: slugify(text)
             })
        })

        p.closeBrowser()
    } catch(err){
        console.log(chalk.red('Произошла ошибка!'))
        console.log(err)
    }
}

main();