import { WaterParser } from '../parsers/water.parser';
import { IFinishParserInfo } from '../templates/interfaces/interfaces';
import { CacheService } from './cache.service';

export class WaterService {
  constructor(
    private waterParser: WaterParser,
    private cacheService: CacheService,
  ) {}

  async getWaterInfo(): Promise<IFinishParserInfo | null> {
    try {
      const info: IFinishParserInfo | null =
        await this.waterParser.getWaterInfo();
      if (!info) return null;
      return info;
    } catch (e) {
      console.log('[-]*WATER PARSER ERROR: ', e);
      return null;
    }
  }

  async showWaterBlackouts(): Promise<string[] | null> {
    const cacheWaterKeys: string[] = await this.cacheService.keys('waterInfo*');

    return cacheWaterKeys.length > 0
      ? ((await this.cacheService.mGet(cacheWaterKeys)) as string[])
      : null;
  }
}
