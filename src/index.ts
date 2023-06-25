import 'dotenv/config';
import 'reflect-metadata';
import TelegramBot from 'node-telegram-bot-api';

import { AppDataSource } from "./db/data-source";
import {commands} from "./commands/commands";
import {CommandStart, Registration} from "./service/start.service";

//Иницифлизация бота
const TOKEN: string | undefined = process.env.TOKEN;
if ( !TOKEN ) throw new Error('Нету токена');

const bot: TelegramBot = new TelegramBot(TOKEN, {polling: true})

async function botRun() {
    //Подключение к БД
    await AppDataSource.initialize()
        .then(() => console.log('BD has connected'))
        .catch((error) => console.log('Error in DB: ', error))

    await bot.setMyCommands(commands);

    bot.onText(/\/start/, async msg => {
        const chatId: number = msg.chat.id;
        const userName: string | undefined = msg.from?.first_name;
        const userId: number | undefined = msg.from?.id;

        await CommandStart(chatId, userName || 'Anonymous', userId, bot)

        await bot.on('message', async msg => {
            const message: string | undefined = msg.text;

            if ( message === 'Зарегистрироваться' ) {
                if ( !userId ) return bot.sendMessage(chatId, 'С вашим аккаунтом что то не так')
                await Registration(userId)
            }
        })

        // bot.on('message', async msg => {
        //     const message: string | undefined = msg.text;
        //     if ( !userId ) return bot.sendMessage(chatId, 'С вашим аккаунтом что то не так')
        //
        //     if ( message === 'Зарегистрироваться' ) {
        //         const isUser: Users | null = await usersRepository.findOne({where: {userId}})
        //         if ( isUser ) return bot.sendMessage(chatId, 'Вы уже зарегистрировались')
        //         await usersRepository.save({chatId: chatId, userId: userId});
        //         return bot.sendMessage(chatId, 'Регистрация прошла успешно')
        //     }
        // })
    })
}

botRun()
