import { WaterService } from './water.service';
import { SocialService } from './social.service';
import { BotService } from './bot.service';

export class LogicService {
  constructor(
    private waterService: WaterService,
    private socialService: SocialService,
    private botService: BotService,
  ) {}

  async sendOutageInfo() {
    const isInfo: string | undefined =
      await this.waterService.cronGetWaterInfo();
    if (isInfo) return this.socialService.messageSender(isInfo);
    return;
  }

  async sendWaterBlackout(chatId: number) {
    const isCache: string[] | null =
      await this.waterService.showWaterBlackouts();
    if (isCache)
      return this.botService.sendMessage(
        chatId,
        isCache?.join('\n') || 'Не получена информация об отключении воды.',
      );
    return;
  }
}
