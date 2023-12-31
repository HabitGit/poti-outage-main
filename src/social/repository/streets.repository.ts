import { DataSource, ILike, Repository } from 'typeorm';
import { Streets } from '../../db/entitys/streets.entity';
import { CreateStreetDto } from '../../templates/dtos/create-street.dto';
import { UpdateStreetDto } from '../../templates/dtos/update-street.dto';
import { IStreetsName } from '../../templates/types/types';

export class StreetsRepository extends Repository<Streets> {
  constructor(private dataSource: DataSource) {
    super(Streets, dataSource.createEntityManager());
  }

  async createStreet(streetData: CreateStreetDto): Promise<Streets> {
    return this.save(streetData);
  }

  async updateStreetById(streetData: UpdateStreetDto): Promise<Streets> {
    return this.save({
      ...streetData,
    });
  }

  async getStreetById(streetId: number): Promise<Streets | null> {
    return this.findOne({
      where: { id: streetId },
    });
  }

  async getStreets(): Promise<Streets[]> {
    return this.find();
  }

  async getStreetByNameEng(nameEng: string): Promise<Streets | null> {
    return this.findOne({
      where: { nameEng },
    });
  }

  async getStreetsByNamesGeo(names: IStreetsName[]): Promise<Streets[]> {
    return this.find({
      where: names,
    });
  }

  async searchStreetByLikeValue(value: string): Promise<Streets[]> {
    return this.find({
      select: { nameEng: true },
      where: { nameEng: ILike(`%${value}%`) },
    });
  }
}
