import axios, { AxiosResponse } from 'axios';
import jsdom from 'jsdom';
import { IFinishParserInfo } from '../templates/interfaces';
import { Helper } from '../service/helper';

const LINK = process.env.WATER_LINK;
const POTI = 'ფოთის ';
const QUERY_START = 'div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)';
const QUERY_END = 'div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3)';

const { JSDOM } = jsdom;

export class WaterParser {
  constructor(
    private helper: Helper,
  ) {
  }

  async getWaterInfo(): Promise<{endDate: Date | null, message: string}> {
    if (!LINK) throw new Error('Нету ссылки на сайт');

    //Axios request
    let html: string = '';
    try {
      const resp: AxiosResponse = await axios.get(LINK);
      html = resp.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log('Ошибка аксисоса: ', err);
      } else {
        console.log('Иная ошибка при получении данных с сайта: ', err);
      }
    }

    //Get html dom
    const dom: jsdom.JSDOM = new JSDOM(html);
    const document: Document = dom.window.document;
    const items: NodeListOf<Element> = document.querySelectorAll('[class="panel panel-default"]');

    //Search info about country
    const infoInMyCountry: Array<Element | null> = [];
    items.forEach(item => {
      const query: Element | null = item.querySelector(('[data-toggle="collapse"]'));
      if (query === null) throw new Error('Item is null');

      const isTextQuery: string | null = query.textContent;
      if (isTextQuery === null) throw new Error('Нету текста у объекта');

      const isCityName: number = isTextQuery.indexOf(POTI);
      if (isCityName >= 0) infoInMyCountry.push(item.querySelector('[class="col-sm-12"]'));
    });

    //get text
    let resultText: Array<IFinishParserInfo> = [];
    infoInMyCountry.forEach((item) => {
      if (item != null) {
        const startQuery: Element | null = item.querySelector(QUERY_START);
        if (startQuery === null) throw new Error('Нету селектора старта');
        const endQuery: Element | null = item.querySelector(QUERY_END);
        if (endQuery === null) throw new Error('Нету квери окончания');
        const startQueryText: string | null = startQuery.textContent;
        if (startQueryText === null) throw new Error('Нету текста у селектора начала');
        const endQueryText: string | null = endQuery.textContent;
        if (endQueryText === null) throw new Error('Нету текста у селектора окончания');

        const start: string = startQueryText.split(': ')[1];
        const end: string = endQueryText.split(': ')[1];

        const startDateSplit: Array<string> = start
          .split(' ')
          [0].split('/');
        const startTimeSplit: Array<string> = start
          .split(' ')
          [1].split(':');
        const endDateSplit: Array<string> = end
          .split(' ')
          [0].split('/');
        const endTimeSplit: Array<string> = end
          .split(' ')
          [1].split(':');

        const startDate: Date = new Date(
          +startDateSplit[2],
          +startDateSplit[1] - 1,
          +startDateSplit[0],
          +startTimeSplit[0],
          +startTimeSplit[1],
        );
        const endDate: Date = new Date(
          +endDateSplit[2],
          +endDateSplit[1] - 1,
          +endDateSplit[0],
          +endTimeSplit[0],
          +endTimeSplit[1],
        );

        resultText.push({
          startDate: startDate,
          endDate: endDate,
        });
        console.log(resultText);
      }
    });
    if (resultText.length === 0) return {endDate: null, message: 'Инфо об отключении воды нет.'};
    return this.helper.infoOutputRefactoring('воды', resultText);
  }
}