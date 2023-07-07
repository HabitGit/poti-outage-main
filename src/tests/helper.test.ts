import 'dotenv/config';
import {IFinishParserInfo} from '../templates/interfaces';
import TelegramBot from 'node-telegram-bot-api';
import {Helper} from '../service/helper';


describe('Testing helper', () => {
    let mockInfoArray1: IFinishParserInfo[];
    let mockInfoArray2: IFinishParserInfo[];
    let mockInfoArray3: IFinishParserInfo[];
    let mockMsg: TelegramBot.Message;

    beforeAll(() => {
        mockInfoArray1 = [
            {
                name: 'воды',
                startDate: '123',
                startTime: '123',
                endDate: '123',
                endTime: '123',
            }
        ];
        mockInfoArray2 = [
            {
                name: 'электричества',
                startDate: '123',
                startTime: '123',
                endDate: '123',
                endTime: '123',
            }
        ];
        mockInfoArray3 = [
            {
                name: 'электричества',
                startDate: '123',
                startTime: '123',
                endDate: '123',
                endTime: '123',
            },
            {
                name: 'воды',
                startDate: '123',
                startTime: '123',
                endDate: '123',
                endTime: '123',
            }
        ];
        mockMsg = {
            message_id: 1,
            date: 1,
            chat: {
                id: 1,
                type: 'private',
            },
            from: {
                id: 1,
                first_name: 'user',
                is_bot: false,
            },
            text: 'text',
        }
    })

    it('Helper has definite', () => {
        const helper = new Helper();
        expect(helper).toBeTruthy();
    })

    it('Test info output refactoring', () => {
        const helper = new Helper();
        const result1 = helper.infoOutputRefactoring(mockInfoArray1);
        const result2 = helper.infoOutputRefactoring(mockInfoArray2);
        const result3 = helper.infoOutputRefactoring(mockInfoArray3);
        expect(result1).toBe(`Найдены следующие отключения воды: 
                      с 123 - 123 
                   по 123 - 123
                   Подробнее по ссылке:
                   ${process.env.WATER_LINK}\n`);
        expect(result2).toBe(`Найдены следующие отключения электричества: 
                      с 123 - 123 
                   по 123 - 123
                   Подробнее по ссылке:
                   ${process.env.ELECTRICITY_LINK}\n`);
        expect(result3).toBe(`Найдены следующие отключения электричества: 
                      с 123 - 123 
                   по 123 - 123
                   Подробнее по ссылке:
                   ${process.env.ELECTRICITY_LINK}\nНайдены следующие отключения воды: 
                      с 123 - 123 
                   по 123 - 123
                   Подробнее по ссылке:
                   ${process.env.WATER_LINK}\n`);
    });

    it('Test get users points', async () => {
        const helper = new Helper();
        const result1 = await helper.getUserPoints(mockMsg);
        expect(result1).toEqual({ chatId: 1, userId: 1, userName: 'user', message: 'text' })
    })
})