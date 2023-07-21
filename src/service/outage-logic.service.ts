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
    const isInfo: string | undefined = await this.waterService.getWaterInfo();
    if (isInfo) return this.socialService.messageSender(isInfo);
    return;
  }

  async sendElectricityOutageInfo() {
    const isInfo: string | undefined =
      await this.electricityService.getElectricityInfo();
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

  async sendElectricityBlackout(chatId: number) {
    const isCache: string[] | null =
      await this.electricityService.showElectricityBlackouts();
    if (isCache)
      return this.botService.sendMessage(
        chatId,
        isCache?.join('\n') || 'Не получена информация об отключении воды.',
      );
    return;
  }
}
