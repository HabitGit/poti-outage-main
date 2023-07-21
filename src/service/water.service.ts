import { WaterParser } from '../parsers/water.parser';
import {
  IGetInfo,
  IOutputRefactoring,
} from '../templates/interfaces/interfaces';
import { BotService } from './bot.service';
import { SocialService } from './social.service';
import { CacheService } from './cache.service';

export class WaterService {
  constructor(
    private waterParser: WaterParser,
    private socialService: SocialService,
    private botService: BotService,
    private cacheService: CacheService,
  ) {}

  async cronGetWaterInfo() {
    const info: IOutputRefactoring = await this.waterParser.getWaterInfo();
    if (info.endDate === null) return;

    const cache: string | null = await this.cacheService.getWaterInfo(
      info as IGetInfo,
    );

    if (info.message !== cache) {
      await this.socialService.messageSender(info.message);
      return;
    }
  }

  async showWaterBlackouts(chatId: number) {
    const cacheWaterKeys: string[] = await this.cacheService.keys('waterInfo*');

    const cacheWater: string[] | null =
      cacheWaterKeys.length > 0
        ? ((await this.cacheService.mGet(cacheWaterKeys)) as string[])
        : null;
    await this.botService.sendMessage(
      chatId,
      cacheWater?.join('\n') || 'Не получена информация об отключении воды.',
    );
  }
}
