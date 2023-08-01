import {
  IFinishParserInfoObject,
  IGetUserPoints,
} from '../interfaces/interfaces';
import TelegramBot from 'node-telegram-bot-api';

export declare abstract class HelperDeclare {
  /**
   * Принимает объект спаршеных данных и преобразует в строку.
   * @Param typeOfPublicService Название аварийной инфраструктуры типа ```string```
   * @Param info Объект спаршенных данных типа ```IFinishParserInfoObject``` среди которых дата начала отключения типа ```Date```, дата окончания отключения типа ```Date```, массив улиц на которых произойдет отключение типа ```string[]```.
   * @Return { Найдены отключения { воды \ электричества } с { Дата начала } по { Дата окончания } На улицах: { Перечисление улиц }}
   */
  abstract infoOutputRefactoring(
    typeOfPublicService: string,
    info: IFinishParserInfoObject,
  ): string;

  /**
   * Получение нужных значений из сообщения боту.
   * @Param msg - сообщение боту типа ```Message``` класса ```TelegramBot```.
   * @Return {  chatId: number; userId: number | undefined; userName: string | undefined; message: string | undefined; }
   * */
  abstract getUserPoints(msg: TelegramBot.Message): IGetUserPoints;
}
