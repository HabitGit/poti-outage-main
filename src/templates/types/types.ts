import { FindOperator } from 'typeorm';

export type Buttons = {
  [buttonLocation: string]: {
    [buttonName: string]: { text: string };
  };
};

export type InlineButtons = {
  [buttonLocation: string]: {
    [buttonName: string]: {
      text: string;
      callback_data: string;
    };
  };
};

export interface IStreetsName {
  nameGeo: FindOperator<string>;
}

export interface IUsersStreetsId {
  id: number;
}
