import TelegramBot from 'node-telegram-bot-api';
import { SocialService } from '../service/social.service';

export class AdminController {
  constructor(private socialService: SocialService) {}

  requestHandlerAdmin = async (
    msg: TelegramBot.Message,
    match: RegExpExecArray | null,
  ) => {
    if (!match) return;
    await this.socialService.messageSender(match[1]);
  };
}
