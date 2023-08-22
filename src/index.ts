import { MessageController } from './gateway/message.controller';
import { AppDataSource } from './db/data-source';
import { Helper } from './templates/helpers/helper';
import { UsersRepository } from './social/repository/users.repository';
import { StreetsService } from './social/streets.service';
import { StreetsRepository } from './social/repository/streets.repository';
import { ConfigEnv } from './config/configEnv';
import { BotService } from './bot/bot.service';
import { SocialService } from './social/social.service';
import { commands } from './bot/commands';
import { WaterService } from './water-outage/water.service';
import { WaterParser } from './water-outage/water.parser';
import { ElectricityService } from './electricity-outage/electricity.service';
import { ElectricityParser } from './electricity-outage/electricity.parser';
import { QueryController } from './gateway/query.controller';
import { CronJob } from 'cron';
import { AdminController } from './gateway/admin.controller';
import { CacheService } from './cache/cache.service';
import { cacheClient } from './cache/data-source.redis';
import { MainService } from './gateway/main-service';
import { StreetsListenersService } from './social/streets-listeners.service';

export class Main {
  constructor(
    private botService: BotService,
    private messageController: MessageController,
    private queryController: QueryController,
    private adminController: AdminController,
    private mainService: MainService,
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
        await this.mainService.sendOutageInfo();
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
const waterParser = new WaterParser(streetsService, configEnv);
const electricityParser = new ElectricityParser(streetsService, configEnv);

const socialService = new SocialService(usersRepository, botService);

const waterService = new WaterService(
  waterParser,
  cacheService,
  helper,
  streetsRepository,
  usersRepository,
  botService,
);

const electricityService = new ElectricityService(
  electricityParser,
  cacheService,
  helper,
  streetsRepository,
  usersRepository,
  botService,
);
const streetsLogicService = new StreetsListenersService(
  streetsService,
  helper,
  botService,
  socialService,
);
const queryController = new QueryController(
  socialService,
  streetsLogicService,
  helper,
  botService,
);

const adminController = new AdminController(socialService);
const mainService = new MainService(
  waterService,
  electricityService,
  botService,
);
const messageController = new MessageController(
  helper,
  botService,
  socialService,
  mainService,
);
const main = new Main(
  botService,
  messageController,
  queryController,
  adminController,
  mainService,
);

main.botOn();
