import 'dotenv/config';
import { MainController } from './controllers/main.controller';
import TelegramBot from 'node-telegram-bot-api';
import { AppDataSource } from './db/data-source';
import { commands } from './commands/commands';
import { CronJob } from 'cron';
import { WaterService } from './service/water.service';
import { ElectricityService } from './service/electricity.service';
import { Helper } from './service/helper';
import { TemplatesText } from './templates/templates.text';
import { WaterParser } from './parsers/water.parser';
import { ElectricityParser } from './parsers/electricity.parser';
import { ClientService } from './service/client.service';
import { UsersRepository } from './db/repository/users.repository';
import { QueryController } from './controllers/query.controller';
import { StreetsService } from './service/streets.service';
import { StreetsRepository } from './db/repository/streets.repository';
import { CreateStreetDto } from './templates/create-street.dto';

//bot init
const TOKEN: string | undefined = process.env.TOKEN;
if (!TOKEN) throw new Error('Нету токена');
export const bot: TelegramBot = new TelegramBot(TOKEN, { polling: true });

export class Start {
  constructor(
    private mainController: MainController,
    private queryController: QueryController,
    private waterService: WaterService,
    private electricityService: ElectricityService,
  ) {}

  async botOn() {
    // Установка комманд
    await bot.setMyCommands(commands);

    //Запрос на информацию об отключениях
    this.job.start();

    // bot.onText(/\/getElectricityInfo/, async () => {
    //     const info = await this.electricityService.cronGetElectricityInfo();
    //     console.log(info);
    // })
    //
    // bot.onText(/\/getWaterInfo/, async () => {
    //     const info = await this.waterService.cronGetWaterInfo();
    //     console.log(info);
    // })
    // bot.onText(/\/addStreet/, async () => {
    //   const testData: CreateStreetDto[] = [
    //     {
    //       nameGeo: 'რუსთაველის რკ.',
    //     },
    //   ];
    //   await this.queryController.addStreet(testData);
    // });

    //Обработка запросов
    bot.on('message', async (msg) => {
      await this.mainController.requestHandler(msg);
    });

    //Обработка квери
    bot.on('callback_query', async (query: TelegramBot.CallbackQuery) => {
      await this.queryController.requestQueryHandler(query);
    });

    const regFromAdmin = new RegExp(`/adm${process.env.ADMIN_PASSWORD}(.+)`);
    bot.onText(regFromAdmin, async (msg, source) => {
      if (source === null) return;
      await this.mainController.toAdmin(source[1]);
    });
  }

  private job = new CronJob({
    cronTime: '0,0 */2 * * *',
    onTick: async () => {
      try {
        await this.waterService.cronGetWaterInfo();
        await this.electricityService.cronGetElectricityInfo();
      } catch (e) {
        console.log('[-]*ERROR* in Crone: ', e);
      }
      console.log('From CRON, check water: ', new Date());
    },
    timeZone: 'Asia/Tbilisi',
  });
}

const helper = new Helper();
const templatesText = new TemplatesText();

const streetsRepository = new StreetsRepository(AppDataSource);
const usersRepository = new UsersRepository(AppDataSource);

const waterParser = new WaterParser(helper);
const electricityParser = new ElectricityParser(helper);

const listenerService = new StreetsService(
  streetsRepository,
  usersRepository,
  helper,
);
const clientService = new ClientService(
  templatesText,
  usersRepository,
  listenerService,
);
const electricityService = new ElectricityService(
  electricityParser,
  clientService,
);
const streetsService = new StreetsService(
  streetsRepository,
  usersRepository,
  helper,
);

const mainController = new MainController(clientService, helper);
const queryController = new QueryController(
  clientService,
  streetsService,
  helper,
);

const waterService = new WaterService(waterParser, clientService);
const start = new Start(
  mainController,
  queryController,
  waterService,
  electricityService,
);

try {
  start.botOn();
} catch (e) {
  console.log('[-]*ERROR* in index file: ', e);
}
