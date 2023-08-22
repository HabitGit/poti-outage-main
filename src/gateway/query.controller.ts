import TelegramBot from 'node-telegram-bot-api';
import { SocialService } from '../social/social.service';
import { Helper } from '../templates/helpers/helper';
import { IGetUserPointsQuery } from '../templates/interfaces/interfaces';
import { BotErrors } from '../templates/errors/errors';
import { BotService } from '../bot/bot.service';
import { StreetsListenersService } from '../social/streets-listeners.service';

export class QueryController {
  constructor(
    private socialService: SocialService,
    private streetsLogicService: StreetsListenersService,
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
          'Введите точное название улицы на английском',
        );
        await this.botService.messageListenerOn(
          this.streetsLogicService.registrationStreetListener,
        );
        break;

      case 'deSt':
        await this.botService.sendMessage(
          chatId,
          'Введите название улицы которую нужно удалить',
        );
        await this.botService.messageListenerOn(
          this.streetsLogicService.deleteStreetListener,
        );
        break;

      case 'seSt':
        await this.botService.sendMessage(
          chatId,
          'Введите часть названия вашей улицы что бы облегчить поиск, пример:\nЕсли ваша улица: *larnakas k. N 17*, то введите к примеру: *larnakas*',
          {
            parse_mode: 'Markdown',
          },
        );
        await this.botService.messageListenerOn(
          this.streetsLogicService.searchStreetListener,
        );
        break;
    }
  };
}
