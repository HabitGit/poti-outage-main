type Buttons = {
    [ buttonLocation: string ]: { [ buttonName: string ]: string }
}
export const buttons = {
    start: {
        registration: {text: 'Зарегистрироваться'},
        login: {text: 'Залогиниться'},
    },
    back: {text: 'Назад'},
    home: {
        checkDisabled: {text: 'Показать имеющиеся отключения'}
    }
}