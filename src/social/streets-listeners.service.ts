import { StreetsService } from './streets.service';
import TelegramBot from 'node-telegram-bot-api';
import { IGetUserPoints } from '../templates/interfaces/interfaces';
import { Helper } from '../templates/helpers/helper';
import { BotService } from '../bot/bot.service';
import { Streets } from '../db/entitys/streets.entity';
import { SocialService } from './social.service';

export class StreetsListenersService {
  constructor(
    private streetsService: StreetsService,
    private helper: Helper,
    private botService: BotService,
    private socialService: SocialService,
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
      await this.streetsService.getStreetByNameEng(streetName);

    if (!isStreet) {
      await this.botService.messageListenerOff(this.registrationStreetListener);
      await this.botService.sendMessage(
        chatId,
        'Такая улица пока что не добавлена в базу, или указана с ошибкой',
      );
      return this.socialService.myInfo(userId, chatId);
    }
    await this.streetsService.registrationStreet(userId, isStreet);
    await this.botService.messageListenerOff(this.registrationStreetListener);
    await this.botService.sendMessage(chatId, 'Улица успешно зарегистрирована');
    return this.socialService.myInfo(userId, chatId);
  };

  searchStreetListener = async (msg: TelegramBot.Message) => {
    const { message: streetName, chatId }: IGetUserPoints =
      this.helper.getUserPoints(msg);

    if (!streetName) {
      return this.botService.sendMessage(
        chatId,
        'Вы не указали название улицы для поиска',
      );
    }

    const streets: string[] = await this.streetsService
      .searchStreets(streetName)
      .then((res) => {
        return res.map((street) => {
          return street.nameEng.toString();
        });
      });
    console.log('STREETS: ', streets);
    await this.botService.messageListenerOff(this.searchStreetListener);
    try {
      await this.botService.sendMessage(
        chatId,
        streets.length > 0 ? streets.join('\n') : 'Не нашлось',
      );
    } catch (e) {
      console.log(e);
    }
  };

  deleteStreetListener = async (msg: TelegramBot.Message) => {
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
        'Вы не указали улицу для удаления',
      );
    }

    const street = await this.streetsService.getStreetByNameEng(streetName);
    if (!street) {
      return this.botService.sendMessage(
        chatId,
        'Такой улицы не зарегистрировано',
      );
    }
    try {
      await this.streetsService.deleteStreetFromUser(userId, street);
      await this.botService.sendMessage(chatId, 'Улица успешно удалена');
      await this.socialService.myInfo(userId, chatId);
      await this.botService.messageListenerOff(this.deleteStreetListener);
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === 'Нету юзера') {
          await this.botService.sendMessage(
            chatId,
            'Вы не зарегистрированы. Нажмите /start что бы начать',
          );
        }
      }
    }
  };
}
