import { WaterParser } from './water.parser';
import { IFinishParserInfo } from '../templates/interfaces/interfaces';
import { CacheService } from '../cache/cache.service';
import { Helper } from '../templates/helpers/helper';
import { ILike } from 'typeorm';
import { StreetsRepository } from '../db/repository/streets.repository';
import { UsersRepository } from '../db/repository/users.repository';
import { BotService } from '../service/bot.service';

export class WaterService {
  constructor(
    private waterParser: WaterParser,
    private cacheService: CacheService,
    private helper: Helper,
    private streetsRepository: StreetsRepository,
    private usersRepository: UsersRepository,
    private botService: BotService,
  ) {}

  async getWaterInfo() {
    let outageInfo: IFinishParserInfo | null = null;

    try {
      outageInfo = await this.waterParser.getWaterInfo();
      if (!outageInfo) return null;
    } catch (e) {
      console.log('[-]*WATER PARSER ERROR: ', e);
      return null;
    }

    for (const info of outageInfo.outageInfo) {
      // Получаем обработанный текст
      const message: string = this.helper.infoOutputRefactoring('воды', info);

      // Отправляем в кэш
      let waterCache: string | null = null;
      try {
        waterCache = await this.cacheService.getCacheInfo({
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
      // Создаем актуальное сообщение
      if (message !== waterCache) {
        for (const chatId of chatsId) {
          await this.botService.sendMessage(chatId.chatId, message);
        }
      }
    }
  }

  async showWaterBlackouts(): Promise<string[] | null> {
    const cacheWaterKeys: string[] = await this.cacheService.keys('waterInfo*');

    return cacheWaterKeys.length > 0
      ? ((await this.cacheService.mGet(cacheWaterKeys)) as string[])
      : null;
  }
}
