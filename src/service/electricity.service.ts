import { ElectricityParser } from '../parsers/electricity.parser';
import {
  IGetInfo,
  IOutputRefactoring,
} from '../templates/interfaces/interfaces';
import { CacheService } from './cache.service';

export class ElectricityService {
  constructor(
    private electricityParser: ElectricityParser,
    private cacheService: CacheService,
  ) {}

  async getElectricityInfo(): Promise<string[] | undefined> {
    const info: IOutputRefactoring[] | null =
      await this.electricityParser.getElectricityInfo();
    if (info === null) return;

    const result: string[] = [];
    for (const outage of info) {
      const cache: string | null = await this.cacheService.getElectricityInfo(
        outage as IGetInfo,
      );
      if (outage.message !== cache) {
        result.push(outage.message + '\n');
      }
    }
    if (result.length === 0) return;
    return result;
  }

  async showElectricityBlackouts(): Promise<string[] | null> {
    const cacheElectricityKeys: string[] = await this.cacheService.keys(
      'electricityInfo*',
    );

    return cacheElectricityKeys.length > 0
      ? ((await this.cacheService.mGet(cacheElectricityKeys)) as string[])
      : null;
  }
}
