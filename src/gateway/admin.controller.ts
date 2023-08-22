import TelegramBot from 'node-telegram-bot-api';
import { Translate } from '../translate/translate';
import { BotService } from '../bot/bot.service';
import { AdminService } from './admin.service';

export class AdminController {
  constructor(
    private botService: BotService,
    private translate: Translate,
    private adminService: AdminService,
  ) {}

  requestHandlerAdmin = async (
    msg: TelegramBot.Message,
    match: RegExpExecArray | null,
  ) => {
    if (!match) return;
    console.log('match: ', match[1].split('/'));
    switch (match[1].split('/')[1]) {
      case 'translate':
        await this.translate.translateToRus();
        break;

      case 'message':
        await this.botService.sendMessage(msg.chat.id, 'Что всем передать?');
        await this.botService.messageListenerOn(
          this.adminService.adminMessageListener,
        );
        break;
    }
  };
}
