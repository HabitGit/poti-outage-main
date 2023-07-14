import { buttons as kb } from './keyboardButtons';
import { IKeyboard } from '../templates/interfaces';

export const keyboard: IKeyboard = {
  start: [[kb.start.registration], [kb.common.back]],
  homeMailingEnable: [
    [kb.home.checkDisabled],
    [kb.home.showLinks],
    [kb.home.mailingDisable],
  ],
  homeMailingDisable: [
    [kb.home.checkDisabled],
    [kb.home.showLinks],
    [kb.home.mailingEnable],
  ],
};
