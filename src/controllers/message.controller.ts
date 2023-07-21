import TelegramBot from 'node-telegram-bot-api';
import { IGetUserPoints } from '../templates/interfaces/interfaces';
import { Helper } from '../templates/helpers/helper';
import { BotService } from '../service/bot.service';
import { CommandService } from '../service/command.service';
import { BotErrors } from '../templates/errors/errors';
import { CreateUserDto } from '../templates/dtos/create-user.dto';
import { SocialService } from '../service/social.service';
import { Message } from '../templates/helpers/messages.template';
import { WaterService } from '../service/water.service';
import { ElectricityService } from '../service/electricity.service';
import { LogicService } from '../service/logic.service';

export class MessageController {
  constructor(
    private helper: Helper,
    private botService: BotService,
    private commandService: CommandService,
    private socialService: SocialService,
    private waterService: WaterService,
    private electricityService: ElectricityService,
    private logicService: LogicService,
  ) {}

  // async toAdmin(message: string) {
  //   await this.clientService.messageSender(message);
  // }

  requestHandler = async (msg: TelegramBot.Message) => {
    const {
      chatId,
      userName = 'Anonymous',
      userId,
      message,
    }: IGetUserPoints = await this.helper.getUserPoints(await msg);

    if (!userId) {
      return this.botService.sendMessage(chatId, Message.invalidUser);
    }

    switch (message) {
      case '/start':
        await this.commandService.start(chatId, userName, userId);
        break;

      case '/myinfo':
        try {
          await this.socialService.myInfo(userId, chatId);
        } catch (e) {
          if (e instanceof BotErrors && e.name === 'USER_UNDEFINED') {
            await this.botService.sendMessage(chatId, Message.userUndefined);
          }
        }
        break;

      case 'Зарегистрироваться':
        const userData: CreateUserDto = { userId: userId, chatId: chatId };
        await this.socialService.registration(userData);
        break;

      case 'Показать имеющиеся отключения воды':
        await this.logicService.sendWaterBlackout(chatId);
        break;

      case 'Показать имеющиеся отключения электричества':
        await this.electricityService.showElectricityBlackouts(chatId);
        break;

      case 'Ссылки на сайты':
        const linksMessage: string =
          'Отключения водоснабжения🚰:\nhttp://water.gov.ge/page/full/107/\nОтключения электричества⚡️:\nhttps://my.energo-pro.ge/ow/#/disconns\nОтключения газа⛽️:\nhttps://mygas.ge/araf/outage';
        await this.botService.sendMessage(chatId, linksMessage);
        break;
    }
  };
}
