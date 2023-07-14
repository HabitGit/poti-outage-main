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

  streets?: string[];
}

export interface IKeyboard {
  start: KeyboardButton[][];

  homeMailingEnable: KeyboardButton[][];

  homeMailingDisable: KeyboardButton[][];
}

export interface IOutputRefactoring {
  endDate: Date | null;

  message: string;
}
