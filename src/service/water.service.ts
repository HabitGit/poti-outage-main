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
    const info: {endDate: Date | null, message: string} = await this.waterParser.getWaterInfo();
    if (info.endDate === null) return;

    const nowDateTimestamp: number = Date.now();
    const endDateTimestamp: number = info.endDate.getTime();
    const timeToKeyLife: number = (endDateTimestamp - nowDateTimestamp) / 1000;
    const key: string = `waterInfo${endDateTimestamp}`;

    const cache: string | null = await cacheClient.get(key);
    await cacheClient.set(key, info.message, { EX: timeToKeyLife });

    if (info.message !== cache) {
      await this.clientService.messageSender(info.message);
      return;
    }
  }
}