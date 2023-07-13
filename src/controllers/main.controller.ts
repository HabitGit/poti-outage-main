import TelegramBot from 'node-telegram-bot-api';
import { IGetUserPoints } from '../templates/interfaces';
import { Helper } from '../service/helper';
import { cacheClient } from '../db/data-source.redis';
import { ClientService } from '../service/client.service';
import { bot } from '../index';
import { CreateUserDto } from '../templates/create-user.dto';

export class MainController {
  constructor(
    private clientService: ClientService,
    private helper: Helper,
  ) {
  }

  async requestHandler(msg: TelegramBot.Message) {
    const { chatId, userName, userId, message }: IGetUserPoints = await this.helper.getUserPoints(msg);
    if (!userId) return bot.sendMessage(chatId, 'С вашим аккаунтом что то не так');

    switch (message) {

      case '/start':
        await this.clientService.CommandStart(chatId, userName || 'Anonymous', userId);
        break;

      case '/myinfo':
        await this.clientService.getMyInfo(userId, chatId);
        break;

      case 'Зарегистрироваться':
        const userData: CreateUserDto = { userId: userId, chatId: chatId };
        await this.clientService.Registration(userData);
        break;

      case 'Показать имеющиеся отключения':
        const cacheWaterKeys: string[] = await cacheClient.keys('waterInfo*');
        const cacheElectricityKeys: string[] = await cacheClient.keys('electricityInfo*');

        const cacheWater: (string | null)[] | null = cacheWaterKeys.length > 0
          ? await cacheClient.mGet(cacheWaterKeys)
          : null;
        const cacheElectricity: (string | null)[] | null = cacheElectricityKeys.length > 0
          ? await cacheClient.mGet(cacheElectricityKeys)
          : null;

        const result = {
          water: cacheWater || 'Не получена информация об отключении воды.',
          electricity: cacheElectricity || 'Не получена информация об отключении электричесва.',
        };
        await bot.sendMessage(chatId, result.water + '\n' + result.electricity);
        break;

      case 'Ссылки на сайты':
        const linksMessage: string = 'Отключения водоснабжения🚰:\nhttp://water.gov.ge/page/full/107/\nОтключения электричества⚡️:\nhttps://my.energo-pro.ge/ow/#/disconns\nОтключения газа⛽️:\nhttps://mygas.ge/araf/outage';
        await bot.sendMessage(chatId, linksMessage);
        break;

      case 'Отключить рассылку':
        await this.clientService.mailingOff(userId, chatId);
        break;

      case 'Включить рассылку':
        await this.clientService.mailingOn(userId, chatId);
        break;
    }
  };

  async toAdmin(message: string) {
    await this.clientService.messageSender(message);
  }
}