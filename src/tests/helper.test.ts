import 'dotenv/config';
import { IFinishParserInfo } from '../templates/interfaces/interfaces';
import TelegramBot from 'node-telegram-bot-api';
import { Helper } from '../templates/helpers/helper';
import { buttons } from '../keyboards/keyboardButtons';

describe('Testing helper', () => {
  let mockInfoArray1: IFinishParserInfo[];
  let mockInfoArray2: IFinishParserInfo[];
  let mockMsg: TelegramBot.Message;
  let mockQuery: TelegramBot.CallbackQuery;

  beforeAll(() => {
    mockInfoArray1 = [
      {
        startDate: new Date(1, 1, 1, 1, 1),
        endDate: new Date(2, 2, 2, 2, 2),
      },
    ];
    mockInfoArray2 = [
      {
        startDate: new Date(1, 1, 1, 1, 1),
        endDate: new Date(2, 2, 2, 2, 2),
      },
    ];
    mockMsg = {
      message_id: 1,
      date: 1,
      chat: {
        id: 1,
        type: 'private',
      },
      from: {
        id: 1,
        first_name: 'user',
        is_bot: false,
      },
      text: 'text',
    };
    mockQuery = {
      id: '1',
      from: {
        id: 1,
        is_bot: false,
        first_name: 'user',
      },
      message: {
        date: 123,
        message_id: 1,
        chat: {
          id: 1,
          type: 'private',
        },
      },
      chat_instance: 'asd',
      data: 'some data',
    };
  });

  it('Helper has definite', () => {
    const helper = new Helper();
    expect(helper).toBeTruthy();
  });

  it('Test info output refactoring', () => {
    const helper = new Helper();
    const result1 = helper.infoOutputRefactoring('воды', mockInfoArray1);
    const result2 = helper.infoOutputRefactoring(
      'электричества',
      mockInfoArray2,
    );
    expect(result1).toEqual({
      endDate: expect.any(Date),
      message: `Найдены отключения воды в период:\nс 01.02.1901, 01:01:00 по 02.03.1902, 02:02:00.\nУзнать точное время про вашу улицу можно на сайте: ${process.env.WATER_LINK}\n`,
    });
    expect(result2).toEqual({
      endDate: expect.any(Date),
      message: `Найдены отключения электричества в период:\nс 01.02.1901, 01:01:00 по 02.03.1902, 02:02:00.\nУзнать точное время про вашу улицу можно на сайте: ${process.env.ELECTRICITY_LINK}\n`,
    });
  });

  it('Test get users points', () => {
    const helper = new Helper();
    const result1 = helper.getUserPoints(mockMsg);
    expect(result1).toEqual({
      chatId: 1,
      userId: 1,
      userName: 'user',
      message: 'text',
    });
  });

  it('Test get user points query', () => {
    const helper = new Helper();
    const result1 = helper.getUserPointsQuery(mockQuery);
    expect(result1).toEqual({
      data: 'some data',
      chatId: 1,
      userId: 1,
    });
  });

  it('Test get keyboard', () => {
    const helper = new Helper();
    const result1 = helper.getKeyboard(
      buttons,
      ['start', 'home', 'common'],
      ['registration', 'checkDisabledWater'],
    );
    expect(result1).toEqual([
      [{ text: 'Зарегистрироваться' }],
      [{ text: 'Показать имеющиеся отключения воды' }],
    ]);
  });
});
