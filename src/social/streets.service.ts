import { StreetsRepository } from './repository/streets.repository';
import { UsersRepository } from './repository/users.repository';
import { Streets } from '../db/entitys/streets.entity';
import { UpdateUserDto } from '../templates/dtos/update-user.dto';
import { CreateStreetDto } from '../templates/dtos/create-street.dto';
import { Users } from '../db/entitys/users.entity';

export class StreetsService {
  constructor(
    private streetsRepository: StreetsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async getStreetByNameGeo(nameGeo: string) {
    return this.streetsRepository.getStreetByNameGeo(nameGeo);
  }

  async createStreet(streetData: CreateStreetDto): Promise<Streets> {
    const isStreet: Streets | null =
      await this.streetsRepository.getStreetByNameGeo(streetData.nameGeo);
    if (isStreet) throw new Error('Такая улица уже существует');
    return this.streetsRepository.createStreet(streetData);
  }

  async registrationStreet(userId: number, street: Streets): Promise<Users> {
    const updateUserData: UpdateUserDto = { userId: userId, street: street };
    return this.usersRepository.addStreetToUser(updateUserData);
  }

  async searchStreets(value: string): Promise<Streets[]> {
    return this.streetsRepository.searchStreetByLikeValue(value);
  }

  async deleteStreetFromUser(userId: number, street: Streets) {
    return this.usersRepository.deleteUsersStreetByUserId(userId, street);
  }
}
