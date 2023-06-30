import TelegramBot from "node-telegram-bot-api";
import {Users} from "../db/entitys/users.entity";
import {keyboard} from "../keyboards/keyboard";
import {Repository} from "typeorm";
import {AppDataSource} from "../db/data-source";
import {TemplatesText} from "../templates/templates.text";

const usersRepository: Repository<Users> = AppDataSource.getRepository(Users);

export class StartService {
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
}