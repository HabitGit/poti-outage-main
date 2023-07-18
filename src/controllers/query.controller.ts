import TelegramBot from 'node-telegram-bot-api';
import { ClientService } from '../service/client.service';
import { Helper } from '../service/helper';
import { CreateStreetDto } from '../templates/create-street.dto';
import { Streets } from '../db/entitys/streets.entity';
import { StreetsService } from '../service/streets.service';

export class QueryController {
  constructor(
    private clientService: ClientService,
    private streetsService: StreetsService,
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

      case 'addS':
        await this.clientService.registrationStreet(userId, chatId);
        break;
    }
  }
}
