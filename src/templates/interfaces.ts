import { KeyboardButton } from 'node-telegram-bot-api';

export interface IGetUserPoints {

    chatId: number

    userId: number | undefined

    userName: string | undefined

    message: string | undefined
}

export interface IFinishParserInfo {

    name: string

    startDate: string

    startTime: string

    endDate: string

    endTime: string
}

export interface IKeyboard {

    [page: string]: KeyboardButton[][]
}