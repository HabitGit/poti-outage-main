import { KeyboardButton } from 'node-telegram-bot-api';

export interface IGetUserPoints {

  chatId: number;

  userId: number | undefined;

  userName: string | undefined;

  message: string | undefined;
}

export interface IFinishParserInfo {

  startDate: Date;

  endDate: Date;
}

export interface IKeyboard {

  [page: string]: KeyboardButton[][];
}