import { WaterService } from './water.service';
import { SocialService } from './social.service';
import { BotService } from './bot.service';
import { ElectricityService } from './electricity.service';
import { CacheService } from './cache.service';
import { Helper } from '../templates/helpers/helper';
import { IFinishParserInfo } from '../templates/interfaces/interfaces';
import { StreetsRepository } from '../db/repository/streets.repository';
import { Users } from '../db/entitys/users.entity';
import { UsersRepository } from '../db/repository/users.repository';
import { ILike } from 'typeorm';

export class OutageLogicService {
  constructor(
    private waterService: WaterService,
    private electricityService: ElectricityService,
    private socialService: SocialService,
    private botService: BotService,
    private cacheService: CacheService,
    private helper: Helper,
    private streetsRepository: StreetsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async sendOutageInfo() {
    // Получили сырую информацию
    const isWaterInfo: IFinishParserInfo | null =
      await this.waterService.getWaterInfo();
    const isElectricityInfo: IFinishParserInfo | null =
      await this.electricityService.getElectricityInfo();

    const waterMessage: Array<{ chatsId: Users[]; message: string }> = [];
    if (isWaterInfo) {
      for (const info of isWaterInfo.outageInfo) {
        // получаем обработаный текст
        const message: string = this.helper.infoOutputRefactoring('воды', info);

        // Отправляем в кэш
        const waterCache: string | null = await this.cacheService.getWaterInfo({
          endDate: info.endDate,
          startDate: info.startDate,
          message: message,
          streets: info.streets,
        });

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
        // Создаем актуальное сообщение
        if (message !== waterCache) {
          waterMessage.push({ chatsId: chatsId, message: message });
        }
      }
      // Делаем рассылку по воде
      for (const outage of waterMessage) {
        for (const chatId of outage.chatsId) {
          await this.botService.sendMessage(chatId.chatId, outage.message);
        }
      }
    }

    const electricityMessage: Array<{ chatsId: Users[]; message: string }> = [];
    if (isElectricityInfo) {
      for (const info of isElectricityInfo.outageInfo) {
        // получаем обработанный текст
        const message: string = this.helper.infoOutputRefactoring(
          'электричества',
          info,
        );

        // Получаем кэш
        const electricityCache: string | null =
          await this.cacheService.getElectricityInfo({
            endDate: info.endDate,
            startDate: info.startDate,
            message: message,
            streets: info.streets,
          });

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
        // Создаем актуальное сообщение
        if (message !== electricityCache) {
          electricityMessage.push({ chatsId: chatsId, message: message });
        }
      }
      // Делаем рассылку по электричеству
      for (const outage of electricityMessage) {
        for (const chatId of outage.chatsId) {
          await this.botService.sendMessage(chatId.chatId, outage.message);
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
