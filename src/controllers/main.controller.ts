import TelegramBot from "node-telegram-bot-api";
import {IGetUserPoints} from "../templates/interfaces";
import {Helper} from "../service/helper";
import {cacheClient} from "../db/data-source.redis";
import { ClientService } from '../service/client.service';

export class MainController {
    constructor(
        private clientService: ClientService,
        private helper: Helper,
        ) {}

    async requestHandler(msg: TelegramBot.Message, bot: TelegramBot) {
        const { chatId, userName, userId, message }: IGetUserPoints = await this.helper.getUserPoints(msg);

        switch (message) {

            case '/start':
                await this.clientService.CommandStart(chatId, userName || 'Anonymous', userId, bot)
                break;

            case 'Зарегистрироваться':
                if ( !userId ) return bot.sendMessage(chatId, 'С вашим аккаунтом что то не так')
                await this.clientService.Registration(userId, chatId, bot)
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

            case '/sendMessageFromAdmin':
                const sendMessage: string = 'Бот будет перезагружен для внесения следующих изменений: теперь он может находить информацию по электричеству. Первые актуальные оповещения поступят после 2х часов ночи, по времени Грузии.';
                await this.clientService.sendMessageFromAdmin(bot, sendMessage);
                break;

            case 'Ссылки на сайты':
                const linksMessage: string = 'Отключения водоснабжения🚰:\nhttp://water.gov.ge/page/full/107/\nОтключения электричества⚡️:\nhttps://my.energo-pro.ge/ow/#/disconns\nОтключения газа⛽️:\nhttps://mygas.ge/araf/outage';
                await bot.sendMessage(chatId, linksMessage);
                break;
        }
    }
}