export class TemplatesText {
    constructor() {}

    welcomeMessage(userName: string): string {
        return `Добро пожаловать ${userName}! Если ты хочешь, что бы тебе начали приходить уведомления об отключениях, то просто зарегистрируйся :)`
    }

    welcomeBackMessage(userName: string): string {
        return `С возвращением, ${userName}! Продолжим?`
    }
}