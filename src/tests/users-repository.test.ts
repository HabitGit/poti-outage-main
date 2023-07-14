import 'dotenv/config';
import { DataSource } from 'typeorm';
import { DataSourceConfigTest } from '../../database.config';
import { UsersRepository } from '../db/repository/users.repository';
import { Users } from '../db/entitys/users.entity';
import { CreateUserDto } from '../templates/create-user.dto';

jest.mock('../db/data-source.redis', () => {
  const originalModule = jest.requireActual('../db/test-data-source.redis');
  return {
    __esModule: true,
    ...originalModule,
  };
});

describe('Users repository testing', () => {
  let usersRepository: UsersRepository;
  let fakeUser: CreateUserDto;
  let fakeUser2: CreateUserDto;

  beforeEach(async () => {
    const AppDataSource: DataSource = new DataSource({
      ...DataSourceConfigTest,
    });

    await AppDataSource.initialize();
    usersRepository = new UsersRepository(AppDataSource);

    fakeUser = {
      userId: 1,
      chatId: 1,
    };

    fakeUser2 = {
      userId: 2,
      chatId: 2,
    };

    //Удаление из бд
    const users: Users[] = await usersRepository.find({
      select: { id: true },
    });
    users.map(async (user: Users) => {
      await usersRepository.delete({ id: user.id });
    });
  });

  it('User rep has been defined', async () => {
    expect(usersRepository).toBeDefined();
  });

  it('Create user func', async () => {
    const user = await usersRepository.createUser(fakeUser);
    expect(user).toEqual({
      id: expect.any(Number),
      userId: 1,
      chatId: 1,
      mailing: true,
    });
  });

  it('Get user by id', async () => {
    const user: Users = await usersRepository.createUser(fakeUser);
    expect(user).toEqual({
      id: expect.any(Number),
      userId: 1,
      chatId: 1,
      mailing: true,
    });
  });

  it('To create 2 same user(Bad request)', async () => {
    await usersRepository.createUser(fakeUser);
    await usersRepository.createUser(fakeUser);
    const findUsers = await usersRepository.find();
    expect(findUsers.length).toBe(1);
  });

  it('Get all chat ids', async () => {
    const isUsers = await usersRepository.getChatIds();
    expect(isUsers.length).toBe(0);
    await usersRepository.createUser(fakeUser);
    await usersRepository.createUser(fakeUser2);
    const isUsersAfter = await usersRepository.getChatIds();
    expect(isUsersAfter.length).toBe(0);
    await setTimeout(async () => {
      const isUsersAfter = await usersRepository.getChatIds();
      expect(isUsersAfter.length).toBe(2);
    }, 11 * 1000);
  });
});
