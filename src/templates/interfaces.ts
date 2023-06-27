export interface IGetUserPoints {

    chatId: number

    userId: number | undefined

    userName: string | undefined

    message: string | undefined
}

export interface IGetWaterInfo {
    start: string

    end: string
}