import { buttons as kb } from './keyboardButtons';
import { IKeyboard } from '../../templates/interfaces/interfaces';

export const Keyboard: IKeyboard = {
  start: [[kb.start.registration]],
  home: [
    [kb.home.checkDisabledWater],
    [kb.home.checkDisabledElectricity],
    [kb.home.showLinks],
  ],
};
