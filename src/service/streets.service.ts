import TelegramBot from 'node-telegram-bot-api';
import { bot } from '../index';
import { StreetsRepository } from '../db/repository/streets.repository';
import { UsersRepository } from '../db/repository/users.repository';
import { UpdateUserDto } from '../templates/update-user.dto';
import { Helper } from './helper';
import { IGetUserPoints } from '../templates/interfaces';
import { CreateStreetDto } from '../templates/create-street.dto';
import { Streets } from '../db/entitys/streets.entity';

export class StreetsService {
  constructor(
    private streetsRepository: StreetsRepository,
    private usersRepository: UsersRepository,
    private helper: Helper,
  ) {}

  registrationStreet = async (msg: TelegramBot.Message) => {
    console.log('RegStr work');
    const {
      message: streetName,
      chatId,
      userId,
    }: IGetUserPoints = this.helper.getUserPoints(msg);

    if (!userId) {
      return bot.sendMessage(chatId, 'Нету данных о вашем телеграмм аккаунте');
    }

    if (!streetName) {
      return bot.sendMessage(chatId, 'Вы не указали улицу, попробуйте снова');
    }

    const isStreet = await this.streetsRepository.getStreetByNameGeo(
      streetName,
    );

    if (!isStreet) {
      return bot.sendMessage(
        chatId,
        'Такой улица пока что не добавлена в базу, или указана с ошибкой',
      );
    }
    const updateUserData: UpdateUserDto = { userId: userId, street: isStreet };
    await this.usersRepository.updateUserByUserId(updateUserData);
    await bot.sendMessage(chatId, 'Улица успешно зарегистрирована');
    await bot.removeListener('message', this.registrationStreet);
  };

  async addStreets(streetsData: CreateStreetDto[]): Promise<Streets[]> {
    const createdStreets: Streets[] = [];
    await streetsData.forEach(async (streetData) => {
      const street: Streets = await this.streetsRepository.createStreet(
        streetData,
      );
      createdStreets.push(street);
    });
    return createdStreets;
  }
}
