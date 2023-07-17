import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import {
  IFinishParserInfo,
  IGetUserPoints,
  IGetUserPointsQuery,
  IOutputRefactoring,
} from '../templates/interfaces';

export class Helper {
  infoOutputRefactoring(
    typeOfPublicService: string,
    infoArray: Array<IFinishParserInfo>,
  ): IOutputRefactoring {
    let startDate: Date = infoArray[0].startDate;
    let endDate: Date = infoArray[0].endDate;
    const streets: Set<string> = new Set();
    infoArray.forEach((date) => {
      startDate = startDate < date.startDate ? startDate : date.startDate;
      endDate = endDate > date.endDate ? endDate : date.endDate;
      date.streets?.forEach((street) => {
        streets.add(street.trim());
      });
    });
    const link: string | undefined =
      typeOfPublicService === 'воды'
        ? process.env.WATER_LINK
        : process.env.ELECTRICITY_LINK;
    const streetsToOutput =
      streets.size > 0
        ? `\nНа улицах:\n${Array.from(streets).join(',\n')}
Узнать точное время про вашу улицу можно на сайте: ${link}\n`
        : `\nУзнать точное время про вашу улицу можно на сайте: ${link}\n`;
    const message: string = `Найдены отключения ${typeOfPublicService} в период:\nс ${startDate.toLocaleString(
      'ru-RU',
    )} по ${endDate.toLocaleString('ru-RU')}.${streetsToOutput}`;
    return { endDate: endDate, message: message };
  }

  getUserPoints(msg: TelegramBot.Message): IGetUserPoints {
    return {
      chatId: msg.chat.id,
      userId: msg.from?.id,
      userName: msg.from?.first_name,
      message: msg.text,
    };
  }

  getUserPointsQuery(query: TelegramBot.CallbackQuery): IGetUserPointsQuery {
    return {
      data: query.data,
      chatId: query.message?.chat.id,
      userId: query.from.id,
    };
  }

  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
