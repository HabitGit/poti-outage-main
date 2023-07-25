import { WaterService } from './water.service';
import { SocialService } from './social.service';
import { BotService } from './bot.service';
import { ElectricityService } from './electricity.service';

export class OutageLogicService {
  constructor(
    private waterService: WaterService,
    private electricityService: ElectricityService,
    private socialService: SocialService,
    private botService: BotService,
  ) {}

  async sendWaterOutageInfo() {
    const isInfo: string[] | undefined = await this.waterService.getWaterInfo();
    if (!isInfo) return;
    for (const message of isInfo) {
      await this.socialService.messageSender(message);
    }
  }

  async sendElectricityOutageInfo() {
    const isInfo: string[] | undefined =
      await this.electricityService.getElectricityInfo();
    if (!isInfo) return;
    for (const message of isInfo) {
      await this.socialService.messageSender(message);
    }
  }

  async sendWaterBlackout(chatId: number) {
    const isCache: string[] | null =
      await this.waterService.showWaterBlackouts();

    if (!isCache) {
      return this.botService.sendMessage(
        chatId,
        'Не получена информация об отключении воды.',
      );
    }

    for (const message of isCache) {
      await this.botService.sendMessage(chatId, message);
    }
  }

  async sendElectricityBlackout(chatId: number) {
    const isCache: string[] | null =
      await this.electricityService.showElectricityBlackouts();

    if (!isCache) {
      return this.botService.sendMessage(
        chatId,
        'Не получена информация об отключении воды.',
      );
    }

    for (const message of isCache) {
      await this.botService.sendMessage(chatId, message);
    }
  }
}
