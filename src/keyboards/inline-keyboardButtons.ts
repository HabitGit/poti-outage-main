import { InlineButtons } from '../templates/types';

export const inlineButtons: InlineButtons = {
  myInfo: {
    addStreet: {
      text: 'Добавить улицу',
      callback_data: 'TCB',
    },
    mailingDisable: {
      text: 'Отключить рассылку',
      callback_data: 'maDi',
    },
    mailingEnable: {
      text: 'Включить рассылку',
      callback_data: 'maEn',
    },
  },
};
