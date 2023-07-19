import { MessageController } from './controllers/message.controller';
import { AppDataSource } from './db/data-source';
import { Helper } from './service/helper';
import { UsersRepository } from './db/repository/users.repository';
import { StreetsService } from './service/streets.service';
import { StreetsRepository } from './db/repository/streets.repository';
import { ConfigEnv } from './config/configEnv';
import { BotService } from './service/bot.service';
import { CommandService } from './service/command.service';
import { SocialService } from './service/social.service';
import { commands } from './commands/commands';
import { WaterService } from './service/water.service';
import { WaterParser } from './parsers/water.parser';
import { ElectricityService } from './service/electricity.service';
import { ElectricityParser } from './parsers/electricity.parser';
import { QueryController } from './controllers/query.controller';
import { CronJob } from 'cron';
import { AdminController } from './controllers/admin.controller';

export class Main {
  constructor(
    private botService: BotService,
    private messageController: MessageController,
    private queryController: QueryController,
    private waterService: WaterService,
    private electricityService: ElectricityService,
    private adminController: AdminController,
  ) {}

  async botOn() {
    try {
      await botService.setMyCommands(commands);
      await botService.messageListenerOn(this.messageController.requestHandler);
      await botService.queryListenerOn(
        this.queryController.requestQueryHandler,
      );
      await botService.adminListener(this.adminController.requestHandlerAdmin);

      this.job.start();
    } catch (e) {
      console.log('[-]*ERROR* in index file: ', e);
    }
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

const configEnv = new ConfigEnv();

const helper = new Helper();
const streetsRepository = new StreetsRepository(AppDataSource);
const usersRepository = new UsersRepository(AppDataSource);
//
const waterParser = new WaterParser(helper);
const electricityParser = new ElectricityParser(helper);
const botService = new BotService(configEnv);
const streetsService = new StreetsService(
  streetsRepository,
  helper,
  botService,
);

const commandService = new CommandService(usersRepository, botService);
const socialService = new SocialService(
  usersRepository,
  botService,
  streetsService,
);
const waterService = new WaterService(waterParser, socialService, botService);

const electricityService = new ElectricityService(
  electricityParser,
  socialService,
  botService,
);

const queryController = new QueryController(
  socialService,
  streetsService,
  helper,
);
const messageController = new MessageController(
  helper,
  botService,
  commandService,
  socialService,
  waterService,
  electricityService,
);
const adminController = new AdminController(socialService);
const main = new Main(
  botService,
  messageController,
  queryController,
  waterService,
  electricityService,
  adminController,
);

main.botOn();
