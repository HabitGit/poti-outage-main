import TelegramBot from 'node-telegram-bot-api';
import { ClientService } from '../service/client.service';
import { Helper } from '../service/helper';

export class QueryController {
  constructor(
    private clientService: ClientService,
    private helper: Helper,
  ) {}

  async requestQueryHandler(query: TelegramBot.CallbackQuery) {
    const { data, userId, chatId } = this.helper.getUserPointsQuery(query);
    if (!chatId) return;

    switch (data) {
      case 'maDi':
        await this.clientService.mailingOff(userId, chatId);
        break;

      case 'maEn':
        await this.clientService.mailingOn(userId, chatId);
        break;
    }
  }
}
