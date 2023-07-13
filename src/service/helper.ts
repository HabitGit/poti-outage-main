import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import {
  IFinishParserInfo,
  IGetUserPoints,
  IOutputRefactoring
} from '../templates/interfaces';

export class Helper {
  infoOutputRefactoring(
    typeOfPublicService: string, infoArray: Array<IFinishParserInfo>
  ): IOutputRefactoring {
    let startDate: Date = infoArray[0].startDate;
    let endDate: Date = infoArray[0].endDate;
    infoArray.forEach(date => {
      startDate = startDate < date.startDate ? startDate : date.startDate;
      endDate = endDate > date.endDate ? endDate : date.endDate;
    });
    const link: string | undefined = typeOfPublicService === 'воды'
      ? process.env.WATER_LINK
      : process.env.ELECTRICITY_LINK;
    const message: string = `Найдены отключения ${typeOfPublicService} в период:\nс ${startDate.toLocaleString('ru-RU')} по ${endDate.toLocaleString('ru-RU')}.\nУзнать точное время про вашу улицу можно на сайте: ${link}\n`;
    return {endDate: endDate, message: message};
  }

  async getUserPoints(msg: TelegramBot.Message): Promise<IGetUserPoints> {
    return {
      chatId: msg.chat.id,
      userId: msg.from?.id,
      userName: msg.from?.first_name,
      message: msg.text,
    };
  }
}