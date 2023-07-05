import {buttons as kb} from "./keyboardButtons";
import {KeyboardButton} from "node-telegram-bot-api";

interface IKeyboard {
    [page: string]: KeyboardButton[][]
}

export const keyboard: IKeyboard = {
    start: [
        [kb.start.registration],
        [kb.common.back],
    ],
    home: [
        [kb.home.checkDisabled],
        [kb.home.showLinks]
    ],
}