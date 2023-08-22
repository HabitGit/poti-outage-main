import { WaterService } from '../water-outage/water.service';
import { BotService } from '../bot/bot.service';
import { ElectricityService } from '../electricity-outage/electricity.service';
import { IFinishParserInfo } from '../templates/interfaces/interfaces';
import { ILike } from 'typeorm';
import { CacheService } from '../cache/cache.service';
import { StreetsRepository } from '../social/repository/streets.repository';
import { UsersRepository } from '../social/repository/users.repository';
import { HelperDeclare } from '../templates/helpers/helper.declare';

export class MainService {
  constructor(
    private waterService: WaterService,
    private electricityService: ElectricityService,
    private botService: BotService,
    private helper: HelperDeclare,
    private cacheService: CacheService,
    private streetsRepository: StreetsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async getOutageInfo(): Promise<void> {
    // Получаем спаршенные данные
    const waterOutageInfo: IFinishParserInfo | null =
      await this.waterService.getWaterInfo();
    const electricityOutageInfo: IFinishParserInfo | null =
      await this.electricityService.getElectricityInfo();

    if (waterOutageInfo) {
      await this.sendOutageInfo(waterOutageInfo);
    }
    if (electricityOutageInfo) {
      await this.sendOutageInfo(electricityOutageInfo);
    }
  }

  async sendOutageInfo(outageInfo: IFinishParserInfo): Promise<void> {
    for (const info of outageInfo.outageInfo) {
      // получаем обработанный текст
      const message: string = this.helper.infoOutputRefactoring(
        outageInfo.name,
        info,
      );

      // Получаем кэш
      let outageCache: string | null = null;
      try {
        outageCache = await this.cacheService.getCacheInfo({
          name: outageInfo.name,
          endDate: info.endDate,
          startDate: info.startDate,
          message: message,
          streets: info.streets,
        });
      } catch (e) {
        console.log(e);
        continue;
      }
      // Формируем массив имен улиц
      const streetsNames = info.streets.map((street) => {
        return { nameGeo: ILike(street) };
      });
      // Получаем айди улиц
      const streetsId = await this.streetsRepository.getStreetsIdByNamesGeo(
        streetsNames,
      );
      // Получаем айди чатов с улицами
      const chatsId = await this.usersRepository.getUsersByStreetsIdOrNull(
        streetsId,
      );
      // Добавляем айди чатов без улиц
      chatsId.push(
        ...(await this.usersRepository.getUsersByStreetsIdOrNull(null)),
      );
      console.log('[*]FINAL CHATS ID: ', chatsId);

      // Создаем актуальное сообщение
      if (message !== outageCache) {
        for (const chatId of chatsId) {
          try {
            await this.botService.sendMessage(chatId.chatId, message);
          } catch (e) {
            console.log('Outage message sender: ', e);
          }
        }
      }
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
        'Не получена информация об отключении электричества.',
      );
    }

    for (const message of isCache) {
      await this.botService.sendMessage(chatId, message);
    }
  }
}
