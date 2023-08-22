import { ElectricityParser } from './electricity.parser';
import { IFinishParserInfo } from '../templates/interfaces/interfaces';
import { CacheService } from '../cache/cache.service';

export class ElectricityService {
  constructor(
    private electricityParser: ElectricityParser,
    private cacheService: CacheService,
  ) {}

  async getElectricityInfo(): Promise<IFinishParserInfo | null> {
    let outageInfo: IFinishParserInfo | null = null;

    try {
      outageInfo = await this.electricityParser.getElectricityInfo();
    } catch (e) {
      console.log('[-]GET ELECTRICITY INFO ERROR: ', e);
    }
    if (!outageInfo) return null;
    return outageInfo;
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
