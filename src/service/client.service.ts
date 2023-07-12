import TelegramBot from "node-telegram-bot-api";
import { Users } from "../db/entitys/users.entity";
import { keyboard } from "../keyboards/keyboard";
import { TemplatesText } from "../templates/templates.text";
import { bot } from '../index';
import { CreateUserDto } from '../templates/create-user.dto';
import { UsersRepository } from '../db/repository/users.repository';

export class ClientService {
  constructor(
    private templatesText: TemplatesText,
    private usersRepository: UsersRepository,
  ) {}

  async CommandStart(chatId: number, userName: string, userId: number): Promise<TelegramBot.Message> {
    const isUser: Users | null = await this.usersRepository.getUserById(userId);
    const message = isUser
      ? this.templatesText.welcomeBackMessage(userName)
      : this.templatesText.welcomeMessage(userName)

    return bot.sendMessage(chatId, message, {
      reply_markup: {
        keyboard: isUser ? keyboard.home : keyboard.start,
        resize_keyboard: true,
      },
    });
  };

  async Registration(userData: CreateUserDto): Promise<TelegramBot.Message> {
    const isUser: Users | null = await this.usersRepository.getUserById(
      userData.userId,
      );

    if ( isUser ) return bot.sendMessage(
      userData.chatId,
      'Вы уже зарегистрированы'
    );

    await this.usersRepository.createUser(userData);

    return bot.sendMessage(userData.chatId, 'Регистрация прошла успешно', {
      reply_markup: {
        keyboard: keyboard.home,
        resize_keyboard: true,
      }
    })
  };

  async sendMessageFromAdmin(message: string) {
    //Должна быть логика проверки на админа
    await this.messageSender(message);
  }

  async messageSender(message: string) {
    const chatIds: Users[] = await this.usersRepository.getMailingChatIds();
    for ( const chatId of chatIds ) {
      try {
        await bot.sendMessage(chatId.chatId, message)
      } catch (e) {
        console.log(e)
      }
    }
  }
}