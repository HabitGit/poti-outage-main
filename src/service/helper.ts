import TelegramBot from "node-telegram-bot-api";
import {IFinishParserInfo, IGetUserPoints} from "../templates/interfaces";

export class Helper {
    waterOutputRefactoring(infoArray: Array<IFinishParserInfo>): string {
        let result: string = '';
        infoArray.forEach(item => {
            result += `Найдено следующее отключение воды: \n    с ${item.startDate} - ${item.startTime} \n   по ${item.endDate} - ${item.endTime}`
        });
        return result;
    }

    async getUserPoints(msg: TelegramBot.Message): Promise<IGetUserPoints> {
        return {
            chatId: msg.chat.id,
            userId: msg.from?.id,
            userName: msg.from?.first_name,
            message: msg.text,
        }
    }
}