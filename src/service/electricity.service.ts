import { ElectricityParser } from '../parsers/electricity.parser';
import { IFinishParserInfo } from '../templates/interfaces/interfaces';
import { CacheService } from './cache.service';

export class ElectricityService {
  constructor(
    private electricityParser: ElectricityParser,
    private cacheService: CacheService,
  ) {}

  async getElectricityInfo(): Promise<IFinishParserInfo | null> {
    try {
      const info: IFinishParserInfo | null =
        await this.electricityParser.getElectricityInfo();
      if (!info) return null;
      return info;
    } catch (e) {
      console.log('[-]*ELECTRICITY PARSER ERROR* :', e);
      return null;
    }
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
