import puppeteer, { Browser, Page } from 'puppeteer';
import jsdom from 'jsdom';
import { IFinishParserInfo, IOutputRefactoring } from '../templates/interfaces';
import { Helper } from '../service/helper';

const LINK = process.env.ELECTRICITY_LINK;
const POTI = 'ფოთი';
const spliterOne = 'გათიშვის არეალი';
const spliterTwo = 'ჩაჭრის თარიღი';
const spliterThree = 'დასახელება:';
const spliterFour = 'აღდგენის თარიღი';

const { JSDOM } = jsdom;

export class ElectricityParser {
  constructor(private helper: Helper) {}

  async getElectricityInfo(): Promise<IOutputRefactoring> {
    if (!LINK) throw new Error('Нету ссылки на сайт');
    let data: string = '';

    try {
      // Получение страницы
      const browser: Browser = await puppeteer.launch({
        headless: 'new',
        args: ['--disable-setuid-sandbox', '--no-sandbox'],
      });
      const page: Page = await browser.newPage();
      await page.goto(LINK);
      data = await page.content();
      await browser.close();
    } catch (e) {
      console.log(e);
    }

    //get HTML dom
    const dom = new JSDOM(data);
    const document = dom.window.document;
    const items: NodeListOf<Element> = document.querySelectorAll(
      '[class="page-alert-wrap ng-star-inserted"]',
    );

    //Search info about country
    const infoInMyCountry: Array<Element | null> = [];
    items.forEach((item) => {
      const query: Element | null = item.querySelector(
        '[class="page-alert-text-title"]',
      );
      if (query === null)
        throw new Error(
          '[ELECTRICITY PARSER]-Нету первого селектора в поиске имени города',
        );

      const isTextQuery: string | null = query.textContent;
      if (isTextQuery === null)
        throw new Error('[ELECTRICITY PARSER]-Нету текста у первого селектора');

      const isCityName: number = isTextQuery.indexOf(POTI);
      if (isCityName >= 0)
        infoInMyCountry.push(
          item.querySelector('[class="page-alert-info-wrap"]'),
        );
    });

    // get text
    const resultText: Array<IFinishParserInfo> = [];
    infoInMyCountry.forEach((item) => {
      if (item != null) {
        const itemText: string | null = item.textContent;
        if (itemText === null)
          throw new Error('[ELECTRICITY PARSER]-Отсутствует текст-информация');
        const streetsArray = itemText
          .split(spliterOne)[1]
          .split(spliterTwo)[0]
          .split(spliterThree)[0]
          .split(':')[1]
          .split(',');

        const streets = streetsArray.map((item) => {
          return item.split('/')[2];
        });

        const resultTextStageOne = itemText
          .split(spliterTwo)[1]
          .split(spliterFour)
          .join('')
          .split(' ');

        const startDateSplit: Array<string> = resultTextStageOne[3].split('-');
        const startTimeSplit: Array<string> = resultTextStageOne[6].split(':');
        const endDateSplit: Array<string> = resultTextStageOne[11].split('-');
        const endTimeSplit: Array<string> = resultTextStageOne[14].split(':');

        const startDate: Date = new Date(
          +startDateSplit[0],
          +startDateSplit[1] - 1,
          +startDateSplit[2],
          +startTimeSplit[0],
          +startTimeSplit[1],
        );
        const endDate: Date = new Date(
          +endDateSplit[0],
          +endDateSplit[1] - 1,
          +endDateSplit[2],
          +endTimeSplit[0],
          +endTimeSplit[1],
        );

        resultText.push({
          startDate: startDate,
          endDate: endDate,
          streets: streets,
        });
      }
    });
    if (resultText.length === 0)
      return {
        endDate: null,
        message: 'Инфо об отключении электричества нет.',
      };
    console.log('[+]FINALLY RESULT ABOUT ELECTRICITY: ', resultText);
    return this.helper.infoOutputRefactoring('электричества', resultText);
  }
}
