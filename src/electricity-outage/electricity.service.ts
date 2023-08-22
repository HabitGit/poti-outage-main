import { ElectricityParser } from './electricity.parser';
import { IFinishParserInfo } from '../templates/interfaces/interfaces';
import { CacheService } from '../cache/cache.service';
import { Helper } from '../templates/helpers/helper';
import { ILike } from 'typeorm';
import { StreetsRepository } from '../social/repository/streets.repository';
import { UsersRepository } from '../social/repository/users.repository';
import { BotService } from '../bot/bot.service';

export class ElectricityService {
  constructor(
    private electricityParser: ElectricityParser,
    private cacheService: CacheService,
    private helper: Helper,
    private streetsRepository: StreetsRepository,
    private usersRepository: UsersRepository,
    private botService: BotService,
  ) {}

  async getElectricityInfo() {
    let outageInfo: IFinishParserInfo | null = null;

    try {
      outageInfo = await this.electricityParser.getElectricityInfo();
      if (!outageInfo) return null;
    } catch (e) {
      console.log('[-]*ELECTRICITY PARSER ERROR* :', e);
      return null;
    }

    for (const info of outageInfo.outageInfo) {
      // получаем обработанный текст
      const message: string = this.helper.infoOutputRefactoring(
        'электричества',
        info,
      );

      // Получаем кэш
      let electricityCache: string | null = null;
      try {
        electricityCache = await this.cacheService.getCacheInfo({
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
      // for test

      // Создаем актуальное сообщение
      if (message !== electricityCache) {
        for (const chatId of chatsId) {
          await this.botService.sendMessage(chatId.chatId, message);
        }
      }
    }
  }

  async showElectricityBlackouts(): Promise<string[] | null> {
    const cacheElectricityKeys: string[] = await this.cacheService.keys(
      'electricityInfo*',
    );

    return cacheElectricityKeys.length > 0
      ? ((await this.cacheService.mGet(cacheElectricityKeys)) as string[])
      : null;
  }
}
