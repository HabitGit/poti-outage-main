import { ElectricityParser } from '../parsers/electricity.parser';
import { cacheClient } from '../db/data-source.redis';
import { ClientService } from './client.service';
import { IOutputRefactoring } from '../templates/interfaces';

export class ElectricityService {
  constructor(
    private electricityParser: ElectricityParser,
    private clientService: ClientService,
  ) {
  }

  async cronGetElectricityInfo() {
    const info: IOutputRefactoring = await this.electricityParser.getElectricityInfo();
    if (info.endDate === null) return;

    const nowDateTimestamp: number = Date.now();
    const endDateTimestamp: number = info.endDate.getTime();
    const timeToKeyLife: number = Math.round((endDateTimestamp - nowDateTimestamp) / 1000);
    const key: string = `electricityInfo${endDateTimestamp}`;

    let cache: string | null = await cacheClient.get(key);
    await cacheClient.set(key, info.message, { EX: timeToKeyLife });

    if (info.message !== cache) {
      await this.clientService.messageSender(info.message);
      return;
    }
  }
}