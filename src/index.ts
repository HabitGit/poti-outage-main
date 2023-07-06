import 'dotenv/config';
import {MainController} from "./controllers/main.controller";
import TelegramBot from "node-telegram-bot-api";
import {AppDataSource} from "./db/data-source";
// import {commands} from "./commands/commands";
import {CronJob} from "cron";
import {WaterService} from "./service/water.service";
import {ElectricityService} from "./service/electricity.service";
import {Helper} from './service/helper';
import {TemplatesText} from './templates/templates.text';
import {StartService} from './service/start.service';
import {WaterParser} from './parsers/water.parser';
import {ElectricityParser} from './parsers/electricity.parser';

const TOKEN: string | undefined = process.env.TOKEN;
if ( !TOKEN ) throw new Error('Нету токена');
export const bot: TelegramBot = new TelegramBot(TOKEN, {polling: true});

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
        // await bot.setMyCommands(commands);

        //Запрос на информацию об отключениях
        this.job.start();

        // bot.onText(/\/getElectricityInfo/, async msg => {
        //     await this.electricityService.cronGetElectricityInfo(bot);
        // })
        //
        // bot.onText(/\/getWaterInfo/, async msg => {
        //     await this.waterService.cronGetWaterInfo(bot);
        // })

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

const helper = new Helper()
const templatesText = new TemplatesText()
const startService = new StartService(templatesText)
const mainController = new MainController(startService, helper)
const waterParser = new WaterParser()
const electricityParser = new ElectricityParser()
const electricityService = new ElectricityService(electricityParser, helper)
const waterService = new WaterService(waterParser, helper)
const start = new Start(mainController, waterService, electricityService)

start.botOn()
