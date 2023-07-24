import { InlineKeyboardButton, KeyboardButton } from 'node-telegram-bot-api';
import { Streets } from '../../db/entitys/streets.entity';

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

export interface IGetInfo {
  endDate: Date;
  message: string;
}

export interface IMyInfo {
  mailing: boolean;
  street: Streets | null;
}

export interface IConfigService {
  get(key: string): string;
}

export interface IResponseData {
  status: number;
  data: Array<IElectricityOutageData>;
}

export interface IElectricityOutageData {
  taskId: number;
  taskName: string;
  taskNote: string;
  scEffectedCustomers: string;
  disconnectionArea: string;
  regionName: string;
  scName: string;
  disconnectionDate: string;
  reconnectionDate: string;
  dif: string;
  taskType: string;
}
