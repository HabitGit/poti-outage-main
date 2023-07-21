import TelegramBot, { KeyboardButton } from 'node-telegram-bot-api';
import { Users } from '../db/entitys/users.entity';
import { Keyboard } from '../keyboards/keyboard';
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

    const keyboard: KeyboardButton[][] = isUser
      ? Keyboard.home
      : Keyboard.start;

    return this.botService.keyboardMessenger(chatId, message, keyboard);
  }
}
