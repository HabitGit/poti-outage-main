import { DataSource, DeleteResult, Repository } from 'typeorm';
import { Users } from '../entitys/users.entity';
import { CreateUserDto } from '../../templates/create-user.dto';
import { cacheClient } from '../data-source.redis';

export class UsersRepository extends Repository<Users> {
  constructor(private dataSource: DataSource) {
    super(Users, dataSource.createEntityManager());
  }

  async createUser(userData: CreateUserDto): Promise<Users> {
    return this.save(userData);
  }

  async getUserById(userId: number): Promise<Users | null> {
    const cache: string | null = await cacheClient.get(`user${userId}`);
    if (cache) return JSON.parse(cache);
    const user: Users | null = await this.findOne({
      where: { userId: userId },
    });
    await cacheClient.set(`user${userId}`, JSON.stringify(user), { EX: 10 });
    return user;
  }

  async getChatIds(): Promise<Users[]> {
    const cache: string | null = await cacheClient.get('mailing');
    if (cache) return JSON.parse(cache);
    const users: Users[] = await this.find({
      select: { chatId: true },
      where: { mailing: true },
    });
    await cacheClient.set('mailing', JSON.stringify(users), { EX: 10 });
    return users;
  }

  async turnMailing(userId: number): Promise<Users> {
    const user: Users | null = await this.findOne({
      where: { userId: userId },
    });
    const updateUser: Users = await this.save({
      ...user,
      mailing: user?.mailing ? false : true,
    });
    await cacheClient.set(`user${userId}`, JSON.stringify(updateUser), {
      EX: 10,
    });
    return updateUser;
  }

  async deleteUserByChatId(chatId: number): Promise<DeleteResult> {
    return this.delete({ chatId: chatId });
  }
}
