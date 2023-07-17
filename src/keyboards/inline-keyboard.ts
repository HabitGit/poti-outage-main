import { IInlineKeyboard } from '../templates/interfaces';
import { inlineButtons as ikb } from './inline-keyboardButtons';

export const inlineKeyboard: IInlineKeyboard = {
  myInfoEnable: [
    // [ikb.myInfo.addStreet],
    [ikb.myInfo.mailingDisable],
  ],
  myInfoDisable: [
    // [ikb.myInfo.addStreet],
    [ikb.myInfo.mailingEnable],
  ],
};
