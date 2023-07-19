import TelegramBot from 'node-telegram-bot-api';
import { StreetsService } from '../service/streets.service';
import { SocialService } from '../service/social.service';
import { Helper } from '../templates/helpers/helper';
import { IGetUserPointsQuery } from '../templates/interfaces/interfaces';
import { BotErrors } from '../templates/errors/errors';

export class QueryController {
  constructor(
    private socialService: SocialService,
    private streetsService: StreetsService,
    private helper: Helper,
  ) {}

  requestQueryHandler = async (query: TelegramBot.CallbackQuery) => {
    const { data, userId, chatId }: IGetUserPointsQuery =
      this.helper.getUserPointsQuery(query);

    if (!chatId) {
      throw new BotErrors({
        name: 'CHAT_UNDEFINED',
        message: 'Нету айди чата',
      });
    }

    switch (data) {
      case 'maDi':
        await this.socialService.mailingOff(userId, chatId);
        break;

      case 'maEn':
        await this.socialService.mailingOn(userId, chatId);
        break;

      case 'addS':
        await this.socialService.registrationStreet(userId, chatId);
        break;
    }
  }
}
