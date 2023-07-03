import 'dotenv/config';
import {MainController} from "./controllers/main.controller";
import TelegramBot from "node-telegram-bot-api";
import {AppDataSource} from "./db/data-source";
import {commands} from "./commands/commands";
import {CronJob} from "cron";
import {WaterService} from "./service/water.service";
import {ElectricityService} from "./service/electricity.service";

const TOKEN: string | undefined = process.env.TOKEN;
if ( !TOKEN ) throw new Error('Нету токена');
const bot: TelegramBot = new TelegramBot(TOKEN, {polling: true});

export class Start {
    constructor(
        private mainController: MainController,
        private waterService: WaterService,
        private electricityService: ElectricityService,
    ) {}

    async botOn() {
        //Подключение к БД
        await AppDataSource.initialize()
            .then(() => console.log('BD has connected'))
            .catch((error) => console.log('Error in DB: ', error))

        // Установка комманд
        await bot.setMyCommands(commands);

        //Запрос на информацию об отключениях
        this.job.start();

        //Обработка запросов
        bot.on('message', async msg => {
            await this.mainController.requestHandler(msg, bot);
        })
    }

    private job = new CronJob({cronTime: '0,0 */2 * * *',onTick: async () => {
            await this.waterService.cronGetWaterInfo(bot);
            await this.electricityService.cronGetElectricityInfo(bot);
            console.log('From CRON, check water: ', new Date())
        }, timeZone: 'Asia/Tbilisi'})
}
