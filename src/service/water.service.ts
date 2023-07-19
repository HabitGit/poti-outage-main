import { WaterParser } from '../parsers/water.parser';
import { cacheClient } from '../db/data-source.redis';
import { IOutputRefactoring } from '../templates/interfaces';
import { BotService } from './bot.service';
import { SocialService } from './social.service';

export class WaterService {
  constructor(
    private waterParser: WaterParser,
    private socialService: SocialService,
    private botService: BotService,
  ) {}

  async cronGetWaterInfo() {
    const info: IOutputRefactoring = await this.waterParser.getWaterInfo();
    if (info.endDate === null) return;

    const nowDateTimestamp: number = Date.now();
    const endDateTimestamp: number = info.endDate.getTime();
    const timeToKeyLife: number = Math.round(
      (endDateTimestamp - nowDateTimestamp) / 1000,
    );
    const key: string = `waterInfo${endDateTimestamp}`;

    const cache: string | null = await cacheClient.get(key);
    await cacheClient.set(key, info.message, { EX: timeToKeyLife });

    if (info.message !== cache) {
      await this.socialService.messageSender(info.message);
      return;
    }
  }

  async showWaterBlackouts(chatId: number) {
    const cacheWaterKeys: string[] = await cacheClient.keys('waterInfo*');

    const cacheWater: string[] | null =
      cacheWaterKeys.length > 0
        ? ((await cacheClient.mGet(cacheWaterKeys)) as string[])
        : null;
    await this.botService.sendMessage(
      chatId,
      cacheWater?.join('\n') || 'Не получена информация об отключении воды.',
    );
  }
}
