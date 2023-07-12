import TelegramBot from 'node-telegram-bot-api';
import { Users } from '../db/entitys/users.entity';
import { keyboard } from '../keyboards/keyboard';
import { TemplatesText } from '../templates/templates.text';
import { bot } from '../index';
import { CreateUserDto } from '../templates/create-user.dto';
import { UsersRepository } from '../db/repository/users.repository';

export class ClientService {
  constructor(
    private templatesText: TemplatesText,
    private usersRepository: UsersRepository,
  ) {
  }

  async CommandStart(chatId: number, userName: string, userId: number): Promise<TelegramBot.Message> {
    const isUser: Users | null = await this.usersRepository.getUserById(userId);
    const message = isUser
      ? this.templatesText.welcomeBackMessage(userName)
      : this.templatesText.welcomeMessage(userName);

    return bot.sendMessage(chatId, message, {
      reply_markup: {
        keyboard: isUser ? keyboard.homeMailingEnable : keyboard.start,
        resize_keyboard: true,
      },
    });
  };

  async Registration(userData: CreateUserDto): Promise<TelegramBot.Message> {
    const isUser: Users | null = await this.usersRepository.getUserById(
      userData.userId,
    );

    if (isUser) return bot.sendMessage(
      userData.chatId,
      'Вы уже зарегистрированы',
    );

    await this.usersRepository.createUser(userData);

    return bot.sendMessage(userData.chatId, 'Регистрация прошла успешно, теперь вам будет приходить рассылка. Что бы ее отменить, выберите соответствующий пунк в меню', {
      reply_markup: {
        keyboard: keyboard.homeMailingEnable,
        resize_keyboard: true,
      },
    });
  };

  async sendMessageFromAdmin(message: string) {
    //Должна быть логика проверки на админа
    await this.messageSender(message);
  }

  async messageSender(message: string) {
    const chatIds: Users[] = await this.usersRepository.getMailingChatIds();
    for (const chatId of chatIds) {
      try {
        await bot.sendMessage(chatId.chatId, message);
      } catch (e) {
        console.log(e);
      }
    }
  }

  async mailingOff(userId: number, chatId: number): Promise<TelegramBot.Message> {
    const isMailing: Users | null = await this.usersRepository.getUserById(userId);
    if ( !isMailing ) return bot.sendMessage(chatId, 'Вы не зарегистрированы', {
      reply_markup: {
        keyboard: keyboard.start,
        resize_keyboard: true,
      },
    });

    if ( !isMailing.mailing ) return bot.sendMessage(chatId, 'Вы уже отключили рассылку', {
      reply_markup: {
        keyboard: keyboard.homeMailingDisable,
        resize_keyboard: true,
      },
    });

    await this.usersRepository.mailingOff(userId);

    return bot.sendMessage(chatId, 'Рассылка отключена', {
      reply_markup: {
        keyboard: keyboard.homeMailingDisable,
        resize_keyboard: true,
      },
    });
  }

  async mailingOn(userId: number, chatId: number): Promise<TelegramBot.Message> {
    const isMailing: Users | null = await this.usersRepository.getUserById(userId);
    if ( !isMailing ) return bot.sendMessage(chatId, 'Вы не зарегистрированы', {
      reply_markup: {
        keyboard: keyboard.start,
        resize_keyboard: true,
      },
    });

    if ( isMailing.mailing ) return bot.sendMessage(chatId, 'Ваша рассылка уже включена', {
      reply_markup: {
        keyboard: keyboard.homeMailingEnable,
        resize_keyboard: true,
      },
    });

    await this.usersRepository.mailingOn(userId);

    return bot.sendMessage(chatId, 'Рассылка включена', {
      reply_markup: {
        keyboard: keyboard.homeMailingEnable,
        resize_keyboard: true,
      },
    });
  }
}