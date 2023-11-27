import puppeteer from 'puppeteer';

export const LAUNCH_PUPPETEER_OPTS = {
    args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu',
    '--window-size=1920x1080',
  ]
};

export const PAGE_PUPPETEER_OPTS = {
  networkIdle2Timeout: 5000,
  waitUntil: 'networkidle2',
  timeout: 3000000
};

export class PuppeteerHandler {
  constructor(site = '') {
    this.browser = null;
    this.page = null;
    this.site = site
  }

  async initBrowser(site) {
    this.site = site
    this.browser = await puppeteer.launch({ headless: "false" });
    this.page = await this.browser.newPage();
    await this.gotoPage(this.site);
  }

  closeBrowser() {
    this.browser.close();
  }

  async gotoPage(url){
    try {
      if (!this.browser) {
        return await this.initBrowser(url);
      }

      await this.page.goto(url, PAGE_PUPPETEER_OPTS);
    } catch (err) {
      throw err;
    }
  }

  async getPageContent(url = '') {
    try {
      if (!this.browser) {
        await this.initBrowser(url);
      };
      await this.gotoPage(url)
      const content = await this.page.content();
      return content;
    } catch (err) {
      throw err;
    }
  }
}