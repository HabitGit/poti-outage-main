import { WaterService } from '../water-outage/water.service';
import { BotService } from '../bot/bot.service';
import { ElectricityService } from '../electricity-outage/electricity.service';

export class MainService {
  constructor(
    private waterService: WaterService,
    private electricityService: ElectricityService,
    private botService: BotService,
  ) {}

  async sendOutageInfo() {
    // Получили сырую информацию
    await this.waterService.getWaterInfo();
    await this.electricityService.getElectricityInfo();
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
        'Не получена информация об отключении электричества.',
      );
    }

    for (const message of isCache) {
      await this.botService.sendMessage(chatId, message);
    }
  }
}
