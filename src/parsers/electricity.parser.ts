import puppeteer, {Browser, Page} from "puppeteer";
import jsdom from "jsdom";
import {deflateRaw} from "zlib";

const LINK = process.env.ELECTRICITY_LINK;
const POTI = 'ფოთი';
const spliterOne = 'ჩაჭრის თარიღი';
const spliterTwo = 'აღდგენის თარიღი';

const { JSDOM } = jsdom;

export class ElectricityParser {
    constructor() {}

    async getElectricityInfo(): Promise<object> {
        if ( !LINK ) throw new Error('Нету ссылки на сайт');

        // Получение страницы
        const browser: Browser = await puppeteer.launch({
            headless: true,
        });
        const page: Page = await browser.newPage();
        await page.goto(LINK);
        const data: string = await page.content();
        await browser.close();

        //get HTML dom
        const dom = new JSDOM(data);
        const document = dom.window.document;
        const items: NodeListOf<Element> = document.querySelectorAll('[class="page-alert-wrap ng-star-inserted"]')

        //Search info about country
        const infoInMyCountry: Array<Element | null> = [];
        items.forEach(item => {
            const query: Element | null = item.querySelector('[class="page-alert-text-title"]');
            if ( query === null ) throw new Error('[ELECTRICITY PARSER]-Нету первого селектора в поиске имени города');

            const isTextQuery: string | null = query.textContent;
            if ( isTextQuery === null ) throw new Error('[ELECTRICITY PARSER]-Нету текста у первого селектора');

            const isCityName: number = isTextQuery.indexOf(POTI);
            if ( isCityName >= 0 ) infoInMyCountry.push(item.querySelector('[class="page-alert-info-wrap"]'))
        })

        // get text
        let resultText: Array<object> = []
        infoInMyCountry.forEach(item => {
            if ( item != null ) {
                const itemText: string | null = item.textContent;
                if ( itemText === null ) throw new Error('[ELECTRICITY PARSER]-Отсутствует текст-информация')
                const resultTextStageOne = itemText
                    .split(spliterOne)[1]
                    .split(spliterTwo)
                    .join('')
                    .split(' ')
                console.log(resultTextStageOne)
                resultText.push({
                    dateStart: resultTextStageOne[3],
                    timeStart: resultTextStageOne[6],
                    dateEnd: resultTextStageOne[11],
                    timeEnd: resultTextStageOne[14],
                })
            }
        })
        return resultText;
    }
}
