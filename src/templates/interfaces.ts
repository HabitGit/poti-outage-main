import { InlineKeyboardButton, KeyboardButton } from 'node-telegram-bot-api';

export interface IGetUserPoints {
  chatId: number;

  userId: number | undefined;

  userName: string | undefined;

  message: string | undefined;
}

export interface IGetUserPointsQuery {
  data?: string;

  chatId?: number;

  userId: number;
}

export interface IFinishParserInfo {
  startDate: Date;

  endDate: Date;

  streets?: string[];
}

export interface IKeyboard {
  start: KeyboardButton[][];

  home: KeyboardButton[][];
}

export interface IInlineKeyboard {
  myInfoEnable: InlineKeyboardButton[][];
  myInfoDisable: InlineKeyboardButton[][];
}

export interface IOutputRefactoring {
  endDate: Date | null;

  message: string;
}
