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

  async getAllChatIds(): Promise<Users[]> {
    return this.find({
      select: { chatId: true }
    });
  }
}