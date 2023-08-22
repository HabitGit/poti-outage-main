import { KeyboardButton } from 'node-telegram-bot-api';
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

export interface IFinishParserInfoObject {
  startDate: Date;
  endDate: Date;
  streets: string[];
}

export interface IFinishParserInfo {
  name: string;
  outageInfo: IFinishParserInfoObject[];
}

export interface IKeyboard {
  start: KeyboardButton[][];
  home: KeyboardButton[][];
}

export interface IGetOutageInfo {
  name: string;
  endDate: Date;
  startDate: Date;
  message: string;
  streets: string[];
}

export interface IMyInfo {
  mailing: boolean;
  street: Streets[];
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
