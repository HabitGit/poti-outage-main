import { ElectricityParser } from '../parsers/electricity.parser';
import { cacheClient } from '../db/data-source.redis';
import { ClientService } from './client.service';

export class ElectricityService {
  constructor(
    private electricityParser: ElectricityParser,
    private clientService: ClientService,
  ) {
  }

  async cronGetElectricityInfo() {
    const info: string = await this.electricityParser.getElectricityInfo();

    let cache: string | null = await cacheClient.get('electricityInfo');
    await cacheClient.set('electricityInfo', info, { EX: 7800 });

    if (info === 'Инфо об отключении электричества нет.') return;
    if (info !== cache) {
      await this.clientService.messageSender(info);
      return;
    }
  }
}