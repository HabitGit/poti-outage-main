import TelegramBot from 'node-telegram-bot-api';
import { StreetsRepository } from '../db/repository/streets.repository';
import { UsersRepository } from '../db/repository/users.repository';
import { Helper } from '../templates/helpers/helper';
import { IGetUserPoints } from '../templates/interfaces/interfaces';
import { BotService } from './bot.service';
import { Streets } from '../db/entitys/streets.entity';
import { UpdateUserDto } from '../templates/dtos/update-user.dto';
import { CreateStreetDto } from '../templates/dtos/create-street.dto';

export class StreetsService {
  constructor(
    private streetsRepository: StreetsRepository,
    private usersRepository: UsersRepository,
    private helper: Helper,
    private botService: BotService,
  ) {}

  registrationStreet = async (msg: TelegramBot.Message) => {
    const {
      message: streetName,
      chatId,
      userId,
    }: IGetUserPoints = this.helper.getUserPoints(msg);

    if (!userId) {
      return this.botService.sendMessage(
        chatId,
        'Нету данных о вашем телеграмм аккаунте',
      );
    }

    if (!streetName) {
      return this.botService.sendMessage(
        chatId,
        'Вы не указали улицу, попробуйте снова',
      );
    }

    const isStreet: Streets | null =
      await this.streetsRepository.getStreetByNameGeo(streetName);

    if (!isStreet) {
      await this.botService.messageListenerOff(this.registrationStreet);
      return this.botService.sendMessage(
        chatId,
        'Такая улица пока что не добавлена в базу, или указана с ошибкой',
      );
    }
    const updateUserData: UpdateUserDto = { userId: userId, street: isStreet };
    await this.usersRepository.updateUserByUserId(updateUserData);
    await this.botService.sendMessage(chatId, 'Улица успешно зарегистрирована');
    await this.botService.messageListenerOff(this.registrationStreet);
  };

  async addStreets(streetsData: CreateStreetDto[]): Promise<Streets[]> {
    const createdStreets: Streets[] = [];
    for (const streetData of streetsData) {
      const street: Streets = await this.streetsRepository.createStreet(
        streetData,
      );
      createdStreets.push(street);
    }
    return createdStreets;
  }
}
