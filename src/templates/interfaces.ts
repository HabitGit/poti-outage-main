export interface IGetUserPoints {

    chatId: number

    userId: number | undefined

    userName: string | undefined

    message: string | undefined
}

export interface IFinishParserInfo {

    startDate: string

    startTime: string

    endDate: string

    endTime: string
}