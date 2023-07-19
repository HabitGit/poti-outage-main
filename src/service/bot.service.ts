import TelegramBot from 'node-telegram-bot-api';
import { IConfigService } from '../config/config.interface';

export class BotService extends TelegramBot {
  constructor(private readonly configService: IConfigService) {
    super(configService.get('TOKEN'), { polling: true });
    console.log('Bot has started...');
  }

  async messageListenerOn(
    listener: (
      message: TelegramBot.Message,
      metadata: TelegramBot.Metadata,
    ) => void,
  ) {
    return this.on('message', listener);
  }

  async messageListenerOff(
    listener: (
      message: TelegramBot.Message,
      metadata: TelegramBot.Metadata,
    ) => void,
  ) {
    return this.removeListener('message', listener);
  }
}
