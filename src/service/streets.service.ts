import { StreetsRepository } from '../db/repository/streets.repository';
import { UsersRepository } from '../db/repository/users.repository';
import { Streets } from '../db/entitys/streets.entity';
import { UpdateUserDto } from '../templates/dtos/update-user.dto';
import { CreateStreetDto } from '../templates/dtos/create-street.dto';
import { UpdateResult } from 'typeorm';

export class StreetsService {
  constructor(
    private streetsRepository: StreetsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async getStreetByNameGeo(nameGeo: string) {
    return this.streetsRepository.getStreetByNameGeo(nameGeo);
  }

  async createStreet(streetData: CreateStreetDto): Promise<Streets> {
    return this.streetsRepository.createStreet(streetData);
  }

  async registrationStreet(
    userId: number,
    street: Streets,
  ): Promise<UpdateResult> {
    const updateUserData: UpdateUserDto = { userId: userId, street: street };
    return this.usersRepository.updateUserByUserId(updateUserData);
  }

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

  async createStreetToParsers(streets: string[]): Promise<Streets[]> {
    const resultStreets: Streets[] = [];
    for (const street of streets) {
      const isStreet: Streets | null = await this.getStreetByNameGeo(street);
      if (isStreet) continue;
      const newStreets = await this.createStreet({ nameGeo: street });
      resultStreets.push(newStreets);
    }
    return resultStreets;
  }
}
