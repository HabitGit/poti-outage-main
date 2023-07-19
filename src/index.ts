import { MessageController } from './controllers/message.controller';
import { AppDataSource } from './db/data-source';
// import { WaterService } from './service/water.service';
// import { ElectricityService } from './service/electricity.service';
import { Helper } from './service/helper';
// import { WaterParser } from './parsers/water.parser';
// import { ElectricityParser } from './parsers/electricity.parser';
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
import { ClientService } from './service/client.service';
import { ElectricityService } from './service/electricity.service';
import { ElectricityParser } from './parsers/electricity.parser';
import { QueryController } from './controllers/query.controller';

export class Main {
  constructor(
    private botService: BotService,
    private messageController: MessageController,
    private queryController: QueryController,
  ) {}

  async botOn() {
    await botService.setMyCommands(commands);
    await botService.messageListenerOn(this.messageController.requestHandler);
    await botService.queryListenerOn(this.queryController.requestQueryHandler);
  }
}

const configEnv = new ConfigEnv();

const helper = new Helper();
const streetsRepository = new StreetsRepository(AppDataSource);
const usersRepository = new UsersRepository(AppDataSource);
//
const waterParser = new WaterParser(helper);
const electricityParser = new ElectricityParser(helper);

const clientService = new ClientService();
const botService = new BotService(configEnv);
const streetsService = new StreetsService(
  streetsRepository,
  helper,
  botService,
);

const electricityService = new ElectricityService(botService);
const waterService = new WaterService(waterParser, clientService, botService);
const commandService = new CommandService(usersRepository, botService);
const socialService = new SocialService(
  usersRepository,
  botService,
  streetsService,
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
const main = new Main(botService, messageController, queryController);

try {
  main.botOn();
} catch (e) {
  console.log('[-]*ERROR* in index file: ', e);
}
