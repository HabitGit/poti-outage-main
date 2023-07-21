import TelegramBot from 'node-telegram-bot-api';
import { SocialService } from '../service/social.service';
import { Helper } from '../templates/helpers/helper';
import { IGetUserPointsQuery } from '../templates/interfaces/interfaces';
import { BotErrors } from '../templates/errors/errors';
import { BotService } from '../service/bot.service';
import { StreetsLogicService } from '../service/streets-logic.service';

export class QueryController {
  constructor(
    private socialService: SocialService,
    private streetsLogicService: StreetsLogicService,
    private helper: Helper,
    private botService: BotService,
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
        await this.botService.sendMessage(
          chatId,
          'Введите название улицы на грузинском, или скопируйте с одного из сайтов',
        );
        await this.botService.messageListenerOn(
          this.streetsLogicService.registrationStreetListener,
        );
        break;
    }
  };

  // async addStreet(streetData: CreateStreetDto[]): Promise<Streets[]> {
  //   return this.streetsService.addStreets(streetData);
  // }
}
