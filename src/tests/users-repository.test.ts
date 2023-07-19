import 'dotenv/config';
import { DataSource } from 'typeorm';
import { DataSourceConfigTest } from '../../database.config';
import { UsersRepository } from '../db/repository/users.repository';
import { Users } from '../db/entitys/users.entity';
import { CreateUserDto } from '../templates/dtos/create-user.dto';
import { cacheClient } from '../db/test-data-source.redis';
import { Helper } from '../templates/helpers/helper';

jest.mock('../db/data-source.redis', () => {
  const originalModule = jest.requireActual('../db/test-data-source.redis');
  return {
    __esModule: true,
    ...originalModule,
  };
});

describe('Users repository testing', () => {
  let helper: Helper;
  let appDataSource: DataSource;
  let usersRepository: UsersRepository;
  let fakeUser: CreateUserDto;
  let fakeUser2: CreateUserDto;

  beforeAll(async () => {
    appDataSource = new DataSource({
      ...DataSourceConfigTest,
    });

    await appDataSource.initialize();
    usersRepository = new UsersRepository(appDataSource);

    fakeUser = {
      userId: 1,
      chatId: 1,
    };

    fakeUser2 = {
      userId: 2,
      chatId: 2,
    };

    helper = new Helper();
  });

  afterEach(async () => {
    await usersRepository.clear();
  });

  afterAll(async () => {
    await cacheClient.quit();
    await appDataSource.destroy();
  });

  it('User rep has been defined', () => {
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
    await helper.delay(4 * 1000);
    const isUsersAfter2 = await usersRepository.getChatIds();
    expect(isUsersAfter2.length).toBe(2);
  });
});
