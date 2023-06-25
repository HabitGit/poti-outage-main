export function WelcomeMessage(userName: string): string {
    return `Добро пожаловать ${userName}! Если ты хочешь, что бы тебе начали приходить уведомления об отключениях, то просто зарегистрируйся :)`
}

export function WelcomeBackMessage(userName: string): string {
    return `С возвращением, ${userName}! Продолжим?`
}