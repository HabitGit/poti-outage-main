export type Buttons = {
  [buttonLocation: string]: {
    [buttonName: string]: { text: string };
  };
};

export type InlineButtons = {
  [buttonLocation: string]: {
    [buttonName: string]: {
      text: string;
      callback_data: string;
    };
  };
};

export type StreetsNamesType = [{ nameGeo: string }];

export type UsersStreetsId = [{ id: number }];
