import { WaterParser } from '../parsers/water.parser';
import { cacheClient } from '../db/data-source.redis';
import { ClientService } from './client.service';

export class WaterService {
  constructor(
    private waterParser: WaterParser,
    private clientService: ClientService,
  ) {
  }

  async cronGetWaterInfo() {
    const info: string = await this.waterParser.getWaterInfo();

    const cache: string | null = await cacheClient.get('waterInfo');
    await cacheClient.set('waterInfo', info, { EX: 7800 });

    if (info === 'Инфо об отключении воды нет.') return;
    if (info !== cache) {
      await this.clientService.messageSender(info);
      return;
    }
  }
}