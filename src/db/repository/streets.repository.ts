import { DataSource, Repository } from 'typeorm';
import { Streets } from '../entitys/streets.entity';
import { CreateStreetDto } from '../../templates/create-street.dto';
import { UpdateStreetDto } from '../../templates/update-street.dto';

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

  async getStreetByNameGeo(nameGeo: string): Promise<Streets | null> {
    return this.findOne({
      where: { nameGeo },
    });
  }
}
