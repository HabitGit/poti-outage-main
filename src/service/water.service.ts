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

  async getWaterInfo(): Promise<string[] | undefined> {
    const info: IOutputRefactoring[] | null =
      await this.waterParser.getWaterInfo();
    if (info === null) return;

    const result: string[] = [];
    for (const outage of info) {
      const cache: string | null = await this.cacheService.getWaterInfo(
        outage as IGetInfo,
      );
      if (outage.message !== cache) {
        result.push(outage.message + '\n');
      }
    }
    if (result.length === 0) return;
    return result;
  }

  async showWaterBlackouts(): Promise<string[] | null> {
    const cacheWaterKeys: string[] = await this.cacheService.keys('waterInfo*');

    return cacheWaterKeys.length > 0
      ? ((await this.cacheService.mGet(cacheWaterKeys)) as string[])
      : null;
  }
}
