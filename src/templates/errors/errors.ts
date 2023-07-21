import { ErrorBase } from './error-base';

type ErrorName =
  | 'BAN_FROM_USER'
  | 'USER_UNDEFINED'
  | 'CHAT_UNDEFINED'
  | 'ADMIN_SOURCE_UNDEFINED';

export class BotErrors extends ErrorBase<ErrorName> {}
