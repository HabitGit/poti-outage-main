import axios, { AxiosResponse } from 'axios';
import jsdom from 'jsdom';
import {
  IFinishParserInfo,
  IOutputRefactoring,
} from '../templates/interfaces/interfaces';
import { Helper } from '../templates/helpers/helper';
import { StreetsService } from '../service/streets.service';

const LINK = process.env.WATER_LINK;
const LOCATOR_START: string =
  'div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)';
const LOCATOR_END: string =
  'div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4)';
const LOCATOR_STREETS =
  'div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(7)';

const { JSDOM } = jsdom;

export class WaterParser {
  constructor(
    private helper: Helper,
    private streetsService: StreetsService,
  ) {}

  async getWaterInfo(): Promise<IOutputRefactoring> {
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
    const items = document.querySelectorAll('[class="col-sm-8"]');
    const resultText: Array<IFinishParserInfo> = [];

    for (const item of items) {
      const startLocator: Element = this.getItemByLocator(item, LOCATOR_START);
      const startText: string = this.getTextByLocator(startLocator);

      const endLocator: Element = this.getItemByLocator(item, LOCATOR_END);
      const endText: string = this.getTextByLocator(endLocator);

      const streetsLocators = this.getItemByLocator(
        item,
        LOCATOR_STREETS,
      ).querySelectorAll('div');
      const start: string = startText.split(': ')[1];
      const end: string = endText.split(': ')[1];

      const streetsArray: string[] = [];
      for (const streetText of streetsLocators) {
        const street = this.getTextByLocator(streetText)
          .trim()
          .split('ფოთი ს. ')
          .join('')
          .split('ფოთი ')
          .join('')
          .trim()
          .split('\n')
          .toString();
        streetsArray.push(street);
        try {
          await this.streetsService.createStreet({ nameGeo: street });
        } catch (e) {
          console.log(e);
        }
      }

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

      resultText.push({
        startDate: startDate,
        endDate: endDate,
        streets: streetsArray,
      });
      console.log('[+]*WATER PARSER* result text: ', resultText);
    }
    if (resultText.length === 0)
      return { endDate: null, message: 'Инфо об отключении воды нет.' };
    return this.helper.infoOutputRefactoring('воды', resultText);
  }

  getItemByLocator(item: Element, locator: string) {
    const isItem: Element | null = item.querySelector(locator);
    if (!isItem)
      throw new Error('Отстуствует элемент у ' + locator + 'локатора');
    return isItem;
  }

  getTextByLocator(item: Element) {
    const isText: string | null = item.textContent;
    if (!isText) throw new Error('Нету текста у локатора ' + item);
    return isText;
  }
}
