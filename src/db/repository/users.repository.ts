import { DataSource, Repository } from 'typeorm';
import { Users } from '../entitys/users.entity';
import { CreateUserDto } from '../../templates/create-user.dto';

export class UsersRepository extends Repository<Users> {
  constructor(private dataSource: DataSource) {
    super(Users, dataSource.createEntityManager());
  }

  async createUser(userData: CreateUserDto): Promise<Users> {
    return this.save(userData);
  }

  async getUserById(userId: number): Promise<Users | null> {
    return this.findOne({
      where: { userId: userId },
    });
  }

  async getMailingChatIds(): Promise<Users[]> {
    return this.find({
      select: { chatId: true },
      where: { mailing: true },
    });
  }

  async mailingOff(userId: number): Promise<Users> {
    const user: Users | null = await this.findOne({
      where: { userId: userId },
    });

    return this.save({
      ...user,
      mailing: false,
    });
  }

  async mailingOn(userId: number): Promise<Users> {
    const user: Users | null = await this.findOne({
      where: { userId: userId },
    });

    return this.save({
      ...user,
      mailing: true,
    });
  }
}