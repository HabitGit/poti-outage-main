import axios, { AxiosResponse } from 'axios';
import jsdom from 'jsdom';
import {
  IFinishParserInfo,
  IOutputRefactoring,
} from '../templates/interfaces/interfaces';
import { Helper } from '../templates/helpers/helper';
import { StreetsService } from '../service/streets.service';

const LINK = process.env.WATER_LINK;
const POTIS = 'ფოთის ';
const QUERY_START =
  'div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)';
const QUERY_END =
  'div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3)';
const QUERY_STREET =
  'div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(5)';

const { JSDOM } = jsdom;

export class WaterParser {
  constructor(
    private helper: Helper,
    private streetsService: StreetsService,
  ) {}

  async getWaterInfo(): Promise<IOutputRefactoring[] | null> {
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
    const items: NodeListOf<Element> = document.querySelectorAll(
      '[class="panel panel-default"]',
    );

    //Search info about country
    const infoInMyCountry: Array<Element | null> = [];
    items.forEach((item) => {
      const query: Element | null = item.querySelector(
        '[data-toggle="collapse"]',
      );
      if (query === null) throw new Error('Item is null');

      const isTextQuery: string | null = query.textContent;
      if (isTextQuery === null) throw new Error('Нету текста у объекта');

      const isCityName: number = isTextQuery.indexOf(POTIS);
      if (isCityName >= 0)
        infoInMyCountry.push(item.querySelector('[class="col-sm-12"]'));
    });

    //get text
    const finalInfo: Array<IFinishParserInfo> = [];
    // infoInMyCountry.forEach((item) => {
    for (const item of infoInMyCountry) {
      if (item != null) {
        const startQuery: Element | null = item.querySelector(QUERY_START);
        if (startQuery === null) throw new Error('Нету селектора старта');

        const endQuery: Element | null = item.querySelector(QUERY_END);
        if (endQuery === null) throw new Error('Нету квери окончания');

        const streetsQuery: Element | null = item.querySelector(QUERY_STREET);
        if (streetsQuery === null) throw new Error('Нету квери улиц');
        const arrayStreetsQuery = streetsQuery.querySelectorAll('div');

        const startQueryText: string | null = startQuery.textContent;
        if (startQueryText === null)
          throw new Error('Нету текста у селектора начала');

        const endQueryText: string | null = endQuery.textContent;
        if (endQueryText === null)
          throw new Error('Нету текста у селектора окончания');

        let streetsResult: Array<string> = [];
        for (const street of arrayStreetsQuery) {
          const textStreet: string | undefined = street.textContent
            ?.trim()
            .split('ფოთი ')
            .join('')
            .split(' ქ.')
            .join('');
          if (!textStreet) continue;
          streetsResult.push(textStreet);
          // try {
          //   await this.streetsService.createStreet({ nameGeo: textStreet });
          // } catch (e) {
          //   console.log(e);
          // }
        }
        if (streetsResult.length > 40) {
          streetsResult = streetsResult.slice(0, 40);
          streetsResult.push('etc...');
        }

        const start: string = startQueryText.split(': ')[1];
        const end: string = endQueryText.split(': ')[1];

        const startDateSplit: Array<string> = start.split(' ')[0].split('/');
        const startTimeSplit: Array<string> = start.split(' ')[1].split(':');
        const endDateSplit: Array<string> = end.split(' ')[0].split('/');
        const endTimeSplit: Array<string> = end.split(' ')[1].split(':');

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

        finalInfo.push({
          startDate: startDate,
          endDate: endDate,
          streets: streetsResult,
        });
        console.log('[+]*WATER PARSER* result text: ', finalInfo);
      }
    }
    // });
    if (finalInfo.length === 0) return null;
    const resultArray: IOutputRefactoring[] = [];

    for (const result of finalInfo) {
      resultArray.push(
        this.helper.infoOutputRefactoring('электричества', result),
      );
    }
    return resultArray;
  }
}
