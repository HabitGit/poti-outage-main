import { ElectricityParser } from '../parsers/electricity.parser';
import {
  IGetInfo,
  IOutputRefactoring,
} from '../templates/interfaces/interfaces';
import { BotService } from './bot.service';
import { SocialService } from './social.service';
import { CacheService } from './cache.service';

export class ElectricityService {
  constructor(
    private electricityParser: ElectricityParser,
    private socialService: SocialService,
    private botService: BotService,
    private cacheService: CacheService,
  ) {}

  async cronGetElectricityInfo() {
    const info: IOutputRefactoring =
      await this.electricityParser.getElectricityInfo();
    if (info.endDate === null) return;

    const cache: string | null = await this.cacheService.getElectricityInfo(
      info as IGetInfo,
    );

    if (info.message !== cache) {
      await this.socialService.messageSender(info.message);
      return;
    }
  }

  async showElectricityBlackouts(chatId: number) {
    const cacheElectricityKeys: string[] = await this.cacheService.keys(
      'electricityInfo*',
    );

    const cacheElectricity: (string | null)[] | null =
      cacheElectricityKeys.length > 0
        ? await this.cacheService.mGet(cacheElectricityKeys)
        : null;
    await this.botService.sendMessage(
      chatId,
      cacheElectricity?.join('\n') ||
        'Не получена информация об отключении электричесва.',
    );
  }
}
