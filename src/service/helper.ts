import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import { IFinishParserInfo, IGetUserPoints } from '../templates/interfaces';

export class Helper {
  infoOutputRefactoring(typeOfPublicService: string, infoArray: Array<IFinishParserInfo>): string {
    let startDate: Date = infoArray[0].startDate;
    let endDate: Date = infoArray[0].endDate;
    infoArray.forEach(date => {
      startDate = startDate < date.startDate ? startDate : date.startDate;
      endDate = endDate > date.endDate ? endDate : date.endDate;
    });
    const link: string | undefined = typeOfPublicService === 'воды'
      ? process.env.WATER_LINK
      : process.env.ELECTRICITY_LINK;
    return `Найдены отключения ${typeOfPublicService} в период:\nс ${startDate.toLocaleString('ru-RU')} по ${endDate.toLocaleString('ru-RU')}.\nУзнать точное время про вашу улицу можно на сайте: ${link}`;
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