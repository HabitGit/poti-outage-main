import { IMyInfo } from '../interfaces/interfaces';

export const Message = {
  invalidUser: 'Отсутствует информация о вашем телеграм аккаунте',
  userUndefined:
    'Вы не зарегистрированы!\nЧто бы зарегистрироваться нажми соответствующую кнопку в меню⤵',
  userDefined: 'Вы уже зарегистрированы',
  successRegistration:
    'Регистрация прошла успешно, теперь вам будет приходить рассылка. Что бы ее отключить, выберите соответствующий пунк в меню',
  mailingAlreadyDisable: 'Вы уже отключили рассылку',
};

export function myInfoOutput(myInfo: IMyInfo): string {
  const mailing: string = myInfo.mailing ? 'активна' : 'неактивна';
  const street: string =
    myInfo.street === null ? 'не указана' : myInfo.street.nameGeo;
  return `Информация о вашем аккаунте:
  Рассылка: *${mailing}*
  Улица: *${street}*
  Рассылка по названию улицы в данный момент не активнa, 
  можно просто ее добавить`;
}

export function welcomeMessage(userName: string): string {
  return `Добро пожаловать ${userName}! Если ты хочешь, что бы тебе начали приходить уведомления об отключениях, то просто зарегистрируйся :)`;
}

export function welcomeBackMessage(userName: string): string {
  return `С возвращением, ${userName}! Продолжим?`;
}
