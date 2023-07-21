import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Users } from '../entitys/users.entity';
import { CreateUserDto } from '../../templates/dtos/create-user.dto';
import { UpdateUserDto } from '../../templates/dtos/update-user.dto';
import { CacheService } from '../../service/cache.service';

export class UsersRepository extends Repository<Users> {
  constructor(
    private dataSource: DataSource,
    private cacheService: CacheService,
  ) {
    super(Users, dataSource.createEntityManager());
  }

  async createUser(userData: CreateUserDto): Promise<Users> {
    const user: Users = await this.save(userData);
    await this.cacheService.set(`user${user.userId}`, JSON.stringify(user), 4);
    return user;
  }

  async getUserByUserId(userId: number): Promise<Users | null> {
    const cache: string | null = await this.cacheService.get(`user${userId}`);
    if (cache) return JSON.parse(cache);

    const user: Users | null = await this.findOne({
      where: { userId: userId },
      relations: { street: true },
    });

    await this.cacheService.set(`user${userId}`, JSON.stringify(user), 4);
    return user;
  }

  async getChatIds(): Promise<Users[]> {
    const cache: string | null = await this.cacheService.get('mailing');
    if (cache) return JSON.parse(cache);
    const users: Users[] = await this.find({
      select: { chatId: true },
      where: { mailing: true },
    });
    await this.cacheService.set('mailing', JSON.stringify(users), 4);
    return users;
  }

  async turnMailing(user: Users): Promise<Users> {
    const updateUser: Users = await this.save({
      ...user,
      mailing: !user.mailing,
    });
    await this.cacheService.set(
      `user${user.userId}`,
      JSON.stringify(updateUser),
      10,
    );
    return updateUser;
  }

  async deleteUserByChatId(chatId: number): Promise<DeleteResult> {
    return this.delete({ chatId: chatId });
  }

  async updateUserByUserId(
    updateUserData: UpdateUserDto,
  ): Promise<UpdateResult> {
    return this.update(
      { userId: updateUserData.userId },
      { street: updateUserData.street },
    );
  }
}
