import TelegramBot from 'node-telegram-bot-api';
import { SocialService } from '../social/social.service';
import { BotService } from '../bot/bot.service';

export class AdminService {
  constructor(
    private socialService: SocialService,
    private botService: BotService,
  ) {}

  adminMessageListener = async (msg: TelegramBot.Message) => {
    if (!msg.text) return;
    await this.socialService.messageSender(msg.text);
    await this.botService.messageListenerOff(this.adminMessageListener);
  };
}
