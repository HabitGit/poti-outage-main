import { IMyInfo } from '../interfaces/interfaces';

export const Message = {
  invalidUser: 'Отсутствует информация о вашем телеграм аккаунте!',
  userUndefined:
    '*Вы не зарегистрированы!*\n\nЧто бы зарегистрироваться, нажмите соответствующую кнопку в меню⤵',
  userDefined: 'Вы уже зарегистрированы.',
  successRegistration:
    '*Регистрация прошла успешно!*\n\nТеперь вам будет приходить рассылка. Что бы ее отключить - выберите соответствующий пункт в меню вашего аккаунта.',
  mailingAlreadyDisable: 'Ваша рассылка уже отключена.',
  help:
    'Как пользоваться ботом:\n' +
    '\n' +
    'Что бы начать получать рассылку достаточно нажать кнопку *"зарегистрироваться"*.\n' +
    '\n' +
    'Проверить наличие всех имеющихся отключений можно нажав на соответствующие кнопки на клавиатуре бота.\n' +
    '\n' +
    'Что бы получать уведомления только по своей улице: ' +
    '\n' +
    '1. Откройте ваш аккаунт выбрав: */myinfo*.' +
    '\n' +
    '2. Выберите пункт *"Найти название улицы"*, и следуйте приведенному примеру/инструкции.' +
    '\n' +
    '3. Если в результате вы получили нужную вам улицу: скопируйте название, нажмите кнопку *"добавить улицу"*, вставьте и отправьте скопированное сообщение.\n' +
    '\n' +
    'Что бы снова начать получать все уведомления - удалите вашу улицу. Список улиц будет переодически пополняется.\n' +
    '\n' +
    'По вопросам, предложениям и прочему пишите мне https://t.me/Habbits',
};

export function myInfoOutput(myInfo: IMyInfo): string {
  const mailing: string = myInfo.mailing ? 'активна' : 'неактивна';
  const streets = myInfo.street?.map((street) => {
    return street.nameGeo;
  });
  const street: string =
    streets === undefined ? 'не указаны' : streets?.join('\n');
  return (
    'Информация о вашем аккаунте:' +
    '\n' +
    `Рассылка: *${mailing}*\n` +
    `Улицы:\n*${street}*\n` +
    '\n' +
    'Рассылка по улицам в тестовом режиме, если нашли ошибку пишите https://t.me/Habbits\n' +
    '\n' +
    'На данный момент название улиц указывается только на грузинском языке.'
  );
}

export function welcomeMessage(userName: string): string {
  return (
    `Добро пожаловать *${userName}*! 👋\n` +
    '\n' +
    'Данный бот предназначен для отслеживания отключений водоснабжения и электричества в городе *Поти*.\n' +
    '\n' +
    'Прочитай инструкцию как пользоваться ботом /help и присоединяйся! 👻'
  );
}

export function welcomeBackMessage(userName: string): string {
  return `Привет *${userName}*! 👋\n\nЕсли забыл как пользоваться ботом - жми 👉 /help`;
}
