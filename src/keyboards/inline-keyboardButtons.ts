import { InlineButtons } from '../templates/types/types';

export const inlineButtons: InlineButtons = {
  myInfo: {
    addStreet: {
      text: 'Добавить улицу',
      callback_data: 'addS',
    },
    mailingDisable: {
      text: 'Отключить рассылку',
      callback_data: 'maDi',
    },
    mailingEnable: {
      text: 'Включить рассылку',
      callback_data: 'maEn',
    },
    deleteStreet: {
      text: 'Удалить улицу',
      callback_data: 'deSt',
    },
  },
};
