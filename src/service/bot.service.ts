import TelegramBot from 'node-telegram-bot-api';
import { IConfigService, IKeyboard } from '../templates/interfaces/interfaces';
import { Keyboard } from '../keyboards/keyboard';

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

  async queryListenerOn(listener: (query: TelegramBot.CallbackQuery) => void) {
    return this.on('callback_query', listener);
  }

  async queryListenerOff(listener: (query: TelegramBot.CallbackQuery) => void) {
    return this.removeListener('callback_query', listener);
  }

  async adminListener(
    callback: (msg: TelegramBot.Message, match: RegExpExecArray | null) => void,
  ) {
    return this.onText(
      new RegExp(`/adm${process.env.ADMIN_PASSWORD}(.+)`),
      callback,
    );
  }
}
