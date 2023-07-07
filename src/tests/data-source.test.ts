import 'dotenv/config';
import { DataSource, Repository } from 'typeorm';
import { Users } from '../db/entitys/users.entity';

describe('Testing database', () => {
  let testDataSource: DataSource;
  let userRepository: Repository<Users>;
  let fakeUser = {};
  let fakeUser2 = {};

  beforeAll(async () => {
    testDataSource = new DataSource({
      type: 'postgres',
      host: process.env.TEST_POSTGRES_HOST,
      port: Number(process.env.TEST_POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.TEST_POSTGRES_DB,
      synchronize: true,
      entities: [Users],
    });
    //Подключение к БД
    await testDataSource.initialize()
      .then(() => console.log('BD has connected'))
      .catch((error) => console.log('Error in DB: ', error))

    userRepository = await testDataSource.getRepository(Users);

    fakeUser = {
      chatId: 1,
      userId: 1,
    };
    fakeUser2 = {
      chatId: 1,
      userId: 1,
    }

  });

  afterAll(async () => {
    await userRepository.delete({userId: 1});
  })

  it('Db run testing', async () => {
    expect(testDataSource).toBeTruthy()
  });

  it('User model has been definite', async () => {
    expect(userRepository).toBeTruthy();
  });

  it('Test to create user', async () => {
    const user = await userRepository.save(fakeUser);
    expect(user).toEqual({id: expect.any(Number), chatId: 1, userId: 1 })
  });

  it('Bat test to create existing user', async () => {
    await expect(userRepository.save(fakeUser2)).rejects.toThrow('duplicate key value violates unique constraint "UQ_096d474fe7c1af7be4726762505"')
  })
})