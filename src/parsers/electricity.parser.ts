import {
  IFinishParserInfo,
  IOutputRefactoring,
  IResponseData,
} from '../templates/interfaces/interfaces';
import { Helper } from '../templates/helpers/helper';
import axios, { AxiosResponse } from 'axios';
import { StreetsService } from '../service/streets.service';

const LINK = process.env.ELECTRICITY_LINK;

export class ElectricityParser {
  constructor(
    private helper: Helper,
    private streetsService: StreetsService,
  ) {}

  async getElectricityInfo(): Promise<IOutputRefactoring[] | null> {
    if (!LINK) throw new Error('Нету ссылки на сайт');
    let respData: string = '';
    try {
      const resp: AxiosResponse = await axios.post(LINK, {
        search: 'ფოთი',
      });
      respData = JSON.stringify(resp.data);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.log('Ошибка аксисоса: ', e);
      } else {
        console.log('Иная ошибка при получении данных с сайта: ', e);
      }
    }

    const arrayRespData: IResponseData = JSON.parse(respData);
    const finalInfo: Array<IFinishParserInfo> = [];

    for (const outage of arrayRespData.data) {
      const startDate: Date = new Date(outage.disconnectionDate);
      const endDate: Date = new Date(outage.reconnectionDate);

      const streets: string[] = outage.disconnectionArea
        .split(',')
        .map((street) => {
          return street.split('/')[2];
        });
      for (const street of streets) {
        try {
          await this.streetsService.createStreet({ nameGeo: street });
        } catch (e) {
          console.log(e);
        }
      }
      console.log(streets);

      finalInfo.push({
        startDate: startDate,
        endDate: endDate,
        streets: streets,
      });
    }
    console.log('[+]FINALLY RESULT ABOUT ELECTRICITY: ', finalInfo);

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
