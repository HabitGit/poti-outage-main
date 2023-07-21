import { StreetsService } from './streets.service';
import TelegramBot from 'node-telegram-bot-api';
import { IGetUserPoints } from '../templates/interfaces/interfaces';
import { Helper } from '../templates/helpers/helper';
import { BotService } from './bot.service';
import { Streets } from '../db/entitys/streets.entity';

export class StreetsLogicService {
  constructor(
    private streetsService: StreetsService,
    private helper: Helper,
    private botService: BotService,
  ) {}

  registrationStreetListener = async (msg: TelegramBot.Message) => {
    const {
      message: streetName,
      chatId,
      userId,
    }: IGetUserPoints = this.helper.getUserPoints(msg);

    if (!userId) {
      return this.botService.sendMessage(
        chatId,
        'Нету данных о вашем телеграмм аккаунте',
      );
    }

    if (!streetName) {
      return this.botService.sendMessage(
        chatId,
        'Вы не указали улицу, попробуйте снова',
      );
    }

    const isStreet: Streets | null =
      await this.streetsService.getStreetByNameGeo(streetName);

    if (!isStreet) {
      await this.botService.messageListenerOff(this.registrationStreetListener);
      return this.botService.sendMessage(
        chatId,
        'Такая улица пока что не добавлена в базу, или указана с ошибкой',
      );
    }
    await this.streetsService.registrationStreet(userId, isStreet);
    await this.botService.messageListenerOff(this.registrationStreetListener);
    return this.botService.sendMessage(
      chatId,
      'Улица успешно зарегистрирована',
    );
  };
}
