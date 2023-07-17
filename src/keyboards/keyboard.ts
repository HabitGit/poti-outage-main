import { buttons as kb } from './keyboardButtons';
import { IKeyboard } from '../templates/interfaces';

export const keyboard: IKeyboard = {
  start: [[kb.start.registration], [kb.common.back]],
  home: [
    [kb.home.checkDisabledWater],
    [kb.home.checkDisabledElectricity],
    [kb.home.showLinks],
  ],
};
