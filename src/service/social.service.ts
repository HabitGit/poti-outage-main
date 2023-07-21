import { CreateUserDto } from '../templates/dtos/create-user.dto';
import TelegramBot from 'node-telegram-bot-api';
import { Users } from '../db/entitys/users.entity';
import { Keyboard } from '../keyboards/keyboard';
import { UsersRepository } from '../db/repository/users.repository';
import { BotService } from './bot.service';
import {
  Message,
  myInfoOutput,
  welcomeBackMessage,
  welcomeMessage,
} from '../templates/helpers/messages.template';
import { BotErrors } from '../templates/errors/errors';
import { inlineKeyboard } from '../keyboards/inline-keyboard';
import * as fs from 'fs';

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
          keyboard: Keyboard.home,
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

  async mailingOn(userId: number, chatId: number) {
    const isUser: Users | null = await this.usersRepository.getUserByUserId(
      userId,
    );
    if (!isUser) {
      return this.botService.sendMessage(chatId, Message.userUndefined);
    }

    if (isUser.mailing) {
      await this.botService.sendMessage(chatId, 'Ваша рассылка уже включена');
      return;
    }

    await this.usersRepository.turnMailing(isUser);

    await this.botService.sendMessage(chatId, 'Рассылка включена');

    await this.myInfo(userId, chatId);
    return;
  }

  async messageSender(message: string) {
    const users: Users[] = await this.usersRepository.getChatIds();
    for (const user of users) {
      try {
        await this.botSendMessage(user.chatId, message);
      } catch (e) {
        if (e instanceof BotErrors) {
          if (e.name === 'BAN_FROM_USER') {
            await this.usersRepository.deleteUserByChatId(user.chatId);
          }
        } else {
          await fs.writeFile(
            __dirname + 'errorsLog.txt',
            '[+]NEW ERROR: ' + e + '\n',
            { flag: 'a' },
            (err) => {
              console.log('ERR FS: ', err);
            },
          );
        }
      }
    }
  }

  async botSendMessage(chatId: number, message: string) {
    try {
      await this.botService.sendMessage(chatId, message);
    } catch (e) {
      throw new BotErrors({
        name: 'BAN_FROM_USER',
        message: 'Bot has been baned from user',
      });
    }
  }

  async welcomeBack(chatId: number, userName: string) {
    return this.botService.keyboardMessenger(
      chatId,
      welcomeBackMessage(userName),
      Keyboard.home,
    );
  }

  async welcome(chatId: number, userName: string) {
    return this.botService.keyboardMessenger(
      chatId,
      welcomeMessage(userName),
      Keyboard.start,
    );
  }
}
