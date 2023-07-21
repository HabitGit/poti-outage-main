import { Buttons } from '../templates/types/types';

export const buttons: Buttons = {
  start: {
    registration: { text: 'Зарегистрироваться' },
    login: { text: 'Залогиниться' },
  },
  common: {
    back: { text: 'Назад' },
  },
  home: {
    checkDisabledWater: { text: 'Показать имеющиеся отключения воды' },
    checkDisabledElectricity: {
      text: 'Показать имеющиеся отключения электричества',
    },
    showLinks: { text: 'Ссылки на сайты' },
    mailingDisable: { text: 'Отключить рассылку' },
    mailingEnable: { text: 'Включить рассылку' },
  },
};
