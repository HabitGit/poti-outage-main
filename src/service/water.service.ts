import { WaterParser } from '../parsers/water.parser';
import {
  IGetInfo,
  IOutputRefactoring,
} from '../templates/interfaces/interfaces';
import { CacheService } from './cache.service';

export class WaterService {
  constructor(
    private waterParser: WaterParser,
    private cacheService: CacheService,
  ) {}

  async getWaterInfo(): Promise<string | undefined> {
    const info: IOutputRefactoring = await this.waterParser.getWaterInfo();
    if (info.endDate === null) return;

    const cache: string | null = await this.cacheService.getWaterInfo(
      info as IGetInfo,
    );

    if (info.message !== cache) {
      return info.message;
    }
    return;
  }

  async showWaterBlackouts(): Promise<string[] | null> {
    const cacheWaterKeys: string[] = await this.cacheService.keys('waterInfo*');

    return cacheWaterKeys.length > 0
      ? ((await this.cacheService.mGet(cacheWaterKeys)) as string[])
      : null;
  }
}
