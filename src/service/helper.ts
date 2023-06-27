import TelegramBot from "node-telegram-bot-api";
import {IGetUserPoints} from "../templates/interfaces";

export class Helper {
    waterOutputRefactoring(infoArray: Array<{start: string, end: string}>): string {
        let result: string = '';
        infoArray.forEach(item => {
            const formatData = [
                item.start.trim().split(' '),
                item.end.trim().split(' '),
            ];
            result += `Найдено следующее отключение воды:
        с ${formatData[0][0]} - ${formatData[0][1]}
        по ${formatData[1][0]} - ${formatData[1][1]}`
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