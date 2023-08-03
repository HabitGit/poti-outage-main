import { DataSource, DeleteResult, IsNull, Repository } from 'typeorm';
import { Users } from '../entitys/users.entity';
import { CreateUserDto } from '../../templates/dtos/create-user.dto';
import { UpdateUserDto } from '../../templates/dtos/update-user.dto';
import { CacheService } from '../../service/cache.service';
import { IUsersStreetsId } from '../../templates/types/types';
import { Streets } from '../entitys/streets.entity';

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
      relations: { streets: true },
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

  async addStreetToUser(userData: UpdateUserDto): Promise<Users> {
    const user = await this.findOne({
      relations: { streets: true },
      where: { userId: userData.userId },
    });
    return this.save({
      ...user,
      streets: [...user!.streets, userData.street],
    });
  }

  async getUsersByStreetsIdOrNull(
    streetsId: IUsersStreetsId[] | null,
  ): Promise<Users[]> {
    return this.find({
      select: { chatId: true },
      relations: { streets: true },
      where: {
        streets: streetsId ? streetsId : { id: IsNull() },
      },
    });
  }

  async deleteUsersStreetByUserId(userId: number, street: Streets) {
    const user: Users | null = await this.findOne({
      relations: { streets: true },
      where: { userId: userId },
    });
    if (!user) {
      throw new Error('Нету юзера');
    }
    user.streets = user.streets.filter((findStreet) => {
      return findStreet.id !== street.id;
    });
    return this.save(user);
  }
}
