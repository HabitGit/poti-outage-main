import TelegramBot from 'node-telegram-bot-api';
import { Users } from '../db/entitys/users.entity';
import { keyboard } from '../keyboards/keyboard';
import { UsersRepository } from '../db/repository/users.repository';
import { BotService } from './bot.service';
import {
  welcomeBackMessage,
  welcomeMessage,
} from '../templates/helpers/messages.template';

export class CommandService {
  constructor(
    private usersRepository: UsersRepository,
    private botService: BotService,
  ) {}

  async start(
    chatId: number,
    userName: string,
    userId: number,
  ): Promise<TelegramBot.Message> {
    const isUser: Users | null = await this.usersRepository.getUserByUserId(
      userId,
    );
    const message: string = isUser
      ? welcomeBackMessage(userName)
      : welcomeMessage(userName);

    return this.botService.sendMessage(chatId, message, {
      reply_markup: {
        keyboard: isUser ? keyboard.home : keyboard.start,
        resize_keyboard: true,
      },
    });
  }
}
