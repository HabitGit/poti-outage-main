import { CreateUserDto } from '../templates/create-user.dto';
import TelegramBot from 'node-telegram-bot-api';
import { Users } from '../db/entitys/users.entity';
import { keyboard } from '../keyboards/keyboard';
import { UsersRepository } from '../db/repository/users.repository';
import { BotService } from './bot.service';
import { Message, myInfoOutput } from '../templates/messages.template';
import { BotErrors } from '../templates/errors';
import { inlineKeyboard } from '../keyboards/inline-keyboard';

export class SocialService {
  constructor(
    private usersRepository: UsersRepository,
    private botService: BotService,
  ) {}

  async registration(userData: CreateUserDto): Promise<TelegramBot.Message> {
    const isUser: Users | null = await this.usersRepository.getUserByUserId(
      userData.userId,
    );

    if (isUser) {
      return this.botService.sendMessage(userData.chatId, Message.userDefined);
    }

    await this.usersRepository.createUser(userData);

    return this.botService.sendMessage(
      userData.chatId,
      Message.successRegistration,
      {
        reply_markup: {
          keyboard: keyboard.home,
          resize_keyboard: true,
        },
      },
    );
  }

  async myInfo(userId: number, chatId: number) {
    const user: Users | null = await this.usersRepository.getUserByUserId(
      userId,
    );

    if (!user) {
      throw new BotErrors({
        name: 'USER_UNDEFINED',
        message: Message.userUndefined,
      });
    }

    const message: string = myInfoOutput({
      mailing: user.mailing,
      street: user.street,
    });

    await this.botService.sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: user.mailing
          ? inlineKeyboard.myInfoEnable
          : inlineKeyboard.myInfoDisable,
      },
      parse_mode: 'Markdown',
    });
  }

  async mailingOff(userId: number, chatId: number) {
    const isUser: Users | null = await this.usersRepository.getUserByUserId(
      userId,
    );
    if (!isUser) {
      return this.botService.sendMessage(chatId, Message.userUndefined);
    }

    if (!isUser.mailing) {
      await this.botService.sendMessage(chatId, Message.mailingAlreadyDisable);
      return;
    }

    await this.usersRepository.turnMailing(isUser);

    await this.botService.sendMessage(chatId, 'Рассылка отключена');

    await this.myInfo(userId, chatId);
    return;
  }
}
