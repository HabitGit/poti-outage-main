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

  async getElectricityInfo() {
    const info: IOutputRefactoring =
      await this.electricityParser.getElectricityInfo();
    if (info.endDate === null) return;

    const cache: string | null = await this.cacheService.getElectricityInfo(
      info as IGetInfo,
    );

    if (info.message !== cache) {
      return info.message;
    }
    return;
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
