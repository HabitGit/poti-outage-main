import TelegramBot, { KeyboardButton } from 'node-telegram-bot-api';
import { IConfigService } from '../templates/interfaces/interfaces';

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

  async keyboardMessenger(
    chatId: number,
    message: string,
    keyboard: KeyboardButton[][],
  ) {
    return this.sendMessage(chatId, message, {
      reply_markup: {
        keyboard: keyboard,
        resize_keyboard: true,
      },
    });
  }
}
