import axios, { AxiosResponse } from 'axios';
import jsdom from 'jsdom';
import {
  IConfigService,
  IFinishParserInfo,
  IFinishParserInfoObject,
} from '../templates/interfaces/interfaces';
import { Translate } from '../translate/translate';

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
    private configService: IConfigService,
    private translate: Translate,
  ) {}

  async getWaterInfo(): Promise<IFinishParserInfo | null> {
    const LINK: string = this.configService.get('WATER_LINK');
    const html: string = await this.getRequestData(LINK);
    const items: NodeListOf<Element> = await this.getHtmlItemsBySelector(
      html,
      '[class="panel panel-default"]',
    );
    const infoInMyCountry: Element[] = await this.searchInfoAboutCountry(items);

    const finalInfo: Array<IFinishParserInfoObject> = [];
    for (const item of infoInMyCountry) {
      const startDate: Date = await this.getDateBySelector(item, QUERY_START);
      const endDate: Date = await this.getDateBySelector(item, QUERY_END);
      const streets: string[] = await this.getStreetsBySelector(
        item,
        QUERY_STREET,
      );

      const streetsEng: string[] =
        this.translate.translateFromGeoToRus(streets);

      finalInfo.push({
        startDate: startDate,
        endDate: endDate,
        streets: streetsEng,
      });
    }
    console.log('[+]*WATER PARSER* result text: ', finalInfo);
    if (finalInfo.length === 0) return null;
    return { name: 'воды', outageInfo: finalInfo };
  }

  async getRequestData(link: string): Promise<string> {
    let html: string = '';
    try {
      const resp: AxiosResponse = await axios.get(link);
      html = resp.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log('Ошибка аксисоса: ', err);
      } else {
        console.log('Иная ошибка при получении данных с сайта: ', err);
      }
    }
    if (!html) throw new Error('Отсутствует HTML');
    return html;
  }

  async getQuerySelector(item: Element, selector: string): Promise<Element> {
    const queryItem: Element | null = item.querySelector(selector);
    if (!queryItem) throw new Error('Селектор отсутствует');
    return queryItem;
  }

  async getTextContent(item: Element): Promise<string> {
    const context: string | null = item.textContent;
    if (!context) throw new Error('Нету текста у селектора');
    return context;
  }

  async searchInfoAboutCountry(items: NodeListOf<Element>): Promise<Element[]> {
    const infoInMyCountry: Element[] = [];
    for (const item of items) {
      const query: Element = await this.getQuerySelector(
        item,
        '[data-toggle="collapse"]',
      );
      const isTextQuery: string = await this.getTextContent(query);

      const isCityName: number = isTextQuery.indexOf(POTIS);
      if (isCityName >= 0)
        infoInMyCountry.push(
          await this.getQuerySelector(item, '[class="col-sm-12"]'),
        );
    }
    return infoInMyCountry;
  }

  async getDateBySelector(item: Element, selector: string): Promise<Date> {
    const query: Element = await this.getQuerySelector(item, selector);
    const queryText: string = await this.getTextContent(query);
    const start: string = queryText.split(': ')[1];

    const dateSplit: Array<string> = start.split(' ')[0].split('/');
    const timeSplit: Array<string> = start.split(' ')[1].split(':');

    return new Date(
      +dateSplit[2],
      +dateSplit[1] - 1,
      +dateSplit[0],
      +timeSplit[0],
      +timeSplit[1],
    );
  }

  async getStreetsBySelector(
    item: Element,
    selector: string,
  ): Promise<string[]> {
    const query: Element = await this.getQuerySelector(item, selector);
    const arrayStreetsQuery: NodeListOf<Element> =
      query.querySelectorAll('div');

    const streetsResult: Array<string> = [];
    for (const street of arrayStreetsQuery) {
      const textStreet: string | undefined = street.textContent
        ?.trim()
        .split('ფოთი ')
        .join('')
        .split(' ქ.')
        .join('')
        .split('.')
        .join('  ')
        .trim()
        .split('  ')
        .join('.');
      if (!textStreet) continue;
      streetsResult.push(textStreet);
    }
    return streetsResult;
  }

  async getHtmlItemsBySelector(html: string, selector: string) {
    const dom: jsdom.JSDOM = new JSDOM(html);
    const document: Document = dom.window.document;
    return document.querySelectorAll(selector);
  }
}
