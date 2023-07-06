import TelegramBot from "node-telegram-bot-api";
import {Users} from "../db/entitys/users.entity";
import {keyboard} from "../keyboards/keyboard";
import {TemplatesText} from "../templates/templates.text";
import { bot, usersRepository } from '../index';

export class ClientService {
  constructor(
    private templatesText: TemplatesText,
  ) {}

  async CommandStart(chatId: number, userName: string, userId: number | undefined, bot: TelegramBot): Promise<TelegramBot.Message | undefined> {
    const isUser: Users | null = await usersRepository.findOne({where: {userId}})
    if ( isUser ) return bot.sendMessage(chatId, this.templatesText.welcomeBackMessage(userName || 'Anonymous'), {
      reply_markup: {
        keyboard: keyboard.home,
        resize_keyboard: true,
      }
    })
    return bot.sendMessage(chatId, this.templatesText.welcomeMessage(userName || 'Anonymous'), {
      reply_markup: {
        keyboard: keyboard.start,
        resize_keyboard: true,
      },
    })
  }

  async Registration(userId: number, chatId: number, bot: TelegramBot) {
    const isUser: Users | null = await usersRepository.findOne({
      where: { userId: userId }
    });
    if ( isUser ) return bot.sendMessage(chatId, 'Вы уже зарегистрированы')
    await usersRepository.save({
      userId: userId,
      chatId: chatId,
    })
    return bot.sendMessage(chatId, 'Регистрация прошла успешно', {
      reply_markup: {
        keyboard: keyboard.home,
        resize_keyboard: true,
      }
    })
  }

  async sendMessageFromAdmin(bot: TelegramBot, message: string) {
    const userIds: Users[] = await usersRepository.find({
      select: { chatId: true },
    });
    for ( const chatId of userIds ) {
      await bot.sendMessage(chatId.chatId, message)
    }
  }

  async messageSender(message: string) {
    const chatIds: Users[] = await usersRepository.find({
      select: {
        chatId: true,
      },
    });

    for ( const chatId of chatIds ) {
      try {
        await bot.sendMessage(chatId.chatId, message)
      } catch (e) {
        console.log(e)
      }
    }
  }

}