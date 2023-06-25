import {WelcomeBackMessage, WelcomeMessage} from "../templates/templates.text";
import {keyboard} from "../keyboards/keyboard";
import {AppDataSource} from "../db/data-source";
import {Users} from "../db/entitys/users.entity";
import TelegramBot from "node-telegram-bot-api";
import {Repository} from "typeorm";

const usersRepository: Repository<Users> = AppDataSource.getRepository(Users);

export async function CommandStart(chatId: number, userName: string, userId: number | undefined, bot: TelegramBot): Promise<TelegramBot.Message | undefined> {
    const isUser: Users | null = await usersRepository.findOne({where: {userId}})
    if ( isUser ) return bot.sendMessage(chatId, WelcomeBackMessage(userName || 'Anonymous'), {
        reply_markup: {
            keyboard: keyboard.home,
            resize_keyboard: true,
        }
    })
    return bot.sendMessage(chatId, WelcomeMessage(userName || 'Anonymous'), {
        reply_markup: {
            keyboard: keyboard.start,
            resize_keyboard: true,
        },
    })
}

export async function Registration(userId: number) {}
