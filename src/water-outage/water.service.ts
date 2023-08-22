import { WaterParser } from './water.parser';
import { IFinishParserInfo } from '../templates/interfaces/interfaces';
import { CacheService } from '../cache/cache.service';

export class WaterService {
  constructor(
    private waterParser: WaterParser,
    private cacheService: CacheService,
  ) {}

  async getWaterInfo(): Promise<IFinishParserInfo | null> {
    let outageInfo: IFinishParserInfo | null = null;

    try {
      outageInfo = await this.waterParser.getWaterInfo();
    } catch (e) {
      console.log('[-]GET WATER INFO ERROR: ', e);
    }
    if (!outageInfo) return null;
    return outageInfo;
  }

  async showWaterBlackouts(): Promise<string[] | null> {
    const cacheWaterKeys: string[] = await this.cacheService.keys('waterInfo*');

    return cacheWaterKeys.length > 0
      ? ((await this.cacheService.mGet(cacheWaterKeys)) as string[])
      : null;
  }
}
