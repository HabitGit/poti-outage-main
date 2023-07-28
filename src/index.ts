import { MessageController } from './controllers/message.controller';
import { AppDataSource } from './db/data-source';
import { Helper } from './templates/helpers/helper';
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
import { CacheService } from './service/cache.service';
import { cacheClient } from './db/data-source.redis';
import { OutageLogicService } from './service/outage-logic.service';
import { StreetsLogicService } from './service/streets-logic.service';

export class Main {
  constructor(
    private botService: BotService,
    private messageController: MessageController,
    private queryController: QueryController,
    private adminController: AdminController,
    private logicService: OutageLogicService,
  ) {}

  async botOn() {
    try {
      await this.botService.setMyCommands(commands);
      await this.botService.messageListenerOn(
        this.messageController.requestHandler,
      );
      await this.botService.queryListenerOn(
        this.queryController.requestQueryHandler,
      );
      await botService.adminListener(this.adminController.requestHandlerAdmin);

      this.job.start();
    } catch (e) {
      console.log('[-]*ERROR* in index file: ', e);
    }
  }

  private job = new CronJob({
    cronTime: '0,0 */1 * * *',
    onTick: async () => {
      try {
        await this.logicService.sendOutageInfo();
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
const cacheService = new CacheService(cacheClient);
const usersRepository = new UsersRepository(AppDataSource, cacheService);
//
const botService = new BotService(configEnv);
const streetsService = new StreetsService(streetsRepository, usersRepository);
const waterParser = new WaterParser(helper, streetsService, configEnv);
const electricityParser = new ElectricityParser(
  helper,
  streetsService,
  configEnv,
);

const socialService = new SocialService(usersRepository, botService, helper);
const commandService = new CommandService(usersRepository, socialService);

const waterService = new WaterService(waterParser, cacheService);

const electricityService = new ElectricityService(
  electricityParser,
  cacheService,
);
const streetsLogicService = new StreetsLogicService(
  streetsService,
  helper,
  botService,
);
const queryController = new QueryController(
  socialService,
  streetsLogicService,
  helper,
  botService,
);

const adminController = new AdminController(socialService);
const outageLogicService = new OutageLogicService(
  waterService,
  electricityService,
  socialService,
  botService,
  cacheService,
  helper,
  streetsRepository,
  usersRepository,
);
const messageController = new MessageController(
  helper,
  botService,
  commandService,
  socialService,
  waterService,
  electricityService,
  outageLogicService,
);
const main = new Main(
  botService,
  messageController,
  queryController,
  adminController,
  outageLogicService,
);

main.botOn();
