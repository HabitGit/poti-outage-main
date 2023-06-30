import TelegramBot from "node-telegram-bot-api";
import {IGetUserPoints} from "../templates/interfaces";
import {StartService} from "../service/start.service";
import {Helper} from "../service/helper";
import {cacheClient} from "../service/water.service";

export class MainController {
    constructor(
        private startService: StartService,
        private helper: Helper,
        ) {}

    async requestHandler(msg: TelegramBot.Message, bot: TelegramBot) {
        const { chatId, userName, userId, message }: IGetUserPoints = await this.helper.getUserPoints(msg);

        switch (message) {

            case '/start':
                await this.startService.CommandStart(chatId, userName || 'Anonymous', userId, bot)
                break;

            case 'Зарегистрироваться':
                if ( !userId ) return bot.sendMessage(chatId, 'С вашим аккаунтом что то не так')
                await this.startService.Registration(userId, chatId, bot)
                break;

            case 'Показать имеющиеся отключения':
                const cacheWater: string | null = await cacheClient.get('waterInfo');
                const cacheElectricity: string | null = await cacheClient.get('electricityInfo');
                const result = {
                    water: cacheWater || 'Не получена информация об отключении воды.',
                    electricity: cacheElectricity || 'Не получена информация об отключении электричесва.',
                }
                await bot.sendMessage(chatId, result.water + '\n' + result.electricity);
                break;

        }
    }
}