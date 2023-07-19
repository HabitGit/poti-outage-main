import { ElectricityParser } from '../parsers/electricity.parser';
import { cacheClient } from '../db/data-source.redis';
import { IOutputRefactoring } from '../templates/interfaces/interfaces';
import { BotService } from './bot.service';
import { SocialService } from './social.service';

export class ElectricityService {
  constructor(
    private electricityParser: ElectricityParser,
    private socialService: SocialService,
    private botService: BotService,
  ) {}

  async cronGetElectricityInfo() {
    const info: IOutputRefactoring =
      await this.electricityParser.getElectricityInfo();
    if (info.endDate === null) return;

    const nowDateTimestamp: number = Date.now();
    const endDateTimestamp: number = info.endDate.getTime();
    const timeToKeyLife: number = Math.round(
      (endDateTimestamp - nowDateTimestamp) / 1000,
    );
    const key: string = `electricityInfo${endDateTimestamp}`;

    const cache: string | null = await cacheClient.get(key);
    await cacheClient.set(key, info.message, { EX: timeToKeyLife });

    if (info.message !== cache) {
      await this.socialService.messageSender(info.message);
      return;
    }
  }

  async showElectricityBlackouts(chatId: number) {
    const cacheElectricityKeys: string[] = await cacheClient.keys(
      'electricityInfo*',
    );

    const cacheElectricity: (string | null)[] | null =
      cacheElectricityKeys.length > 0
        ? await cacheClient.mGet(cacheElectricityKeys)
        : null;
    await this.botService.sendMessage(
      chatId,
      cacheElectricity?.join('\n') ||
        'Не получена информация об отключении электричесва.',
    );
  }
}
