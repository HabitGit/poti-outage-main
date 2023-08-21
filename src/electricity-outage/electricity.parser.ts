import {
  IConfigService,
  IFinishParserInfo,
  IFinishParserInfoObject,
  IResponseData,
} from '../templates/interfaces/interfaces';
import axios, { AxiosResponse } from 'axios';
import { StreetsService } from '../social/streets.service';

export class ElectricityParser {
  constructor(
    private streetsService: StreetsService,
    private configService: IConfigService,
  ) {}

  async getElectricityInfo(): Promise<IFinishParserInfo | null> {
    const LINK: string = this.configService.get('ELECTRICITY_LINK');
    const respData: string = await this.getRequestData(LINK);

    const arrayRespData: IResponseData = JSON.parse(respData);
    const finalInfo: Array<IFinishParserInfoObject> = [];

    for (const outage of arrayRespData.data) {
      const startDate: Date = new Date(outage.disconnectionDate);
      const endDate: Date = new Date(outage.reconnectionDate);

      const streets: string[] = outage.disconnectionArea
        .split(',')
        .map((street) => {
          const string = street.trim().split('/');
          if (string.length === 2) return string[1];
          return string[2];
        });

      finalInfo.push({
        startDate: startDate,
        endDate: endDate,
        streets: streets,
      });
    }
    console.log('[+]FINALLY RESULT ABOUT ELECTRICITY: ', finalInfo);

    if (finalInfo.length === 0) return null;
    return { name: 'электричества', outageInfo: finalInfo };
  }

  async getRequestData(link: string): Promise<string> {
    let respData: string = '';
    try {
      const resp: AxiosResponse = await axios.post(link, {
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
    if (!respData) throw new Error('Отсутстсует Data');
    return respData;
  }
}
