import { ErrorBase } from './error-base';

type ErrorName =
  'BAN_FROM_USER';

export class BotErrors extends ErrorBase<ErrorName> {}