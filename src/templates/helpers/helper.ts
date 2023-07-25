import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import {
  IFinishParserInfo,
  IGetUserPoints,
  IGetUserPointsQuery,
  IOutputRefactoring,
} from '../interfaces/interfaces';
import { Buttons } from '../types/types';

export class Helper {
  infoOutputRefactoring(
    typeOfPublicService: string,
    info: IFinishParserInfo,
  ): IOutputRefactoring {
    const message: string = `Найдены отключения ${typeOfPublicService}:\nс ${info.startDate.toLocaleString(
      'ru-RU',
    )} по ${info.endDate.toLocaleString(
      'ru-RU',
    )} \nНа улицах: \n${info.streets?.join('\n')}`;
    return { endDate: info.endDate, message: message };
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
