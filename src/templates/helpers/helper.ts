import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import {
  IFinishParserInfoObject,
  IGetUserPoints,
  IGetUserPointsQuery,
} from '../interfaces/interfaces';
import { Buttons } from '../types/types';

export class Helper {
  infoOutputRefactoring(
    typeOfPublicService: string,
    info: IFinishParserInfoObject,
  ): string {
    let streets: string[] = info.streets;
    if (info.streets.length > 40) {
      streets = info.streets.slice(0, 40);
      streets.push('etc...');
    }

    console.log('STREETS INTO HELPER: ', streets);
    return `Найдены отключения ${typeOfPublicService}:\nс ${info.startDate.toLocaleString(
      'ru-RU',
    )} по ${info.endDate.toLocaleString('ru-RU')} \nНа улицах: \n${streets.join(
      '\n',
    )}`;
  }

  getUserPoints(msg: TelegramBot.Message): IGetUserPoints {
    return {
      chatId: msg.chat.id,
      userId: msg.from?.id,
      userName: msg.from?.first_name,
      message: msg.text,
    };
  }

  getUserPointsQuery(query: TelegramBot.CallbackQuery): IGetUserPointsQuery {
    return {
      data: query.data,
      chatId: query.message?.chat.id,
      userId: query.from.id,
    };
  }

  getKeyboard<T extends Buttons, L extends keyof T, B extends keyof T[L]>(
    keyboardButtons: T,
    locations: L[],
    buttons: B[],
  ) {
    const result: Array<T[L][B][]> = [];
    locations.map((location) => {
      return buttons.map((button) => {
        const isButton: T[L][B] = keyboardButtons[location][button];
        if (isButton) result.push([isButton]);
      });
    });
    return result;
  }

  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
