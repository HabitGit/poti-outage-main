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
import {WaterParser} from './parsers/water.parser';
import {ElectricityParser} from './parsers/electricity.parser';
import { ClientService } from './service/client.service';
import { Repository } from 'typeorm';
import { Users } from './db/entitys/users.entity';

const TOKEN: string | undefined = process.env.TOKEN;
if ( !TOKEN ) throw new Error('Нету токена');
export const bot: TelegramBot = new TelegramBot(TOKEN, {polling: true});
// Users repository
export const usersRepository: Repository<Users> = AppDataSource.getRepository(Users);

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
            await this.waterService.cronGetWaterInfo();
            await this.electricityService.cronGetElectricityInfo();
            console.log('From CRON, check water: ', new Date())
        }, timeZone: 'Asia/Tbilisi'})
}

const helper = new Helper()
const templatesText = new TemplatesText()
const clientService = new ClientService(templatesText)
const mainController = new MainController(clientService, helper)
const waterParser = new WaterParser(helper)
const electricityParser = new ElectricityParser(helper)
const electricityService = new ElectricityService(electricityParser, clientService)
const waterService = new WaterService(waterParser, clientService)
const start = new Start(mainController, waterService, electricityService)

start.botOn()
