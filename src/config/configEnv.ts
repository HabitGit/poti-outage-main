import process from 'node:process';
import { IConfigService } from '../templates/interfaces/interfaces';

export class ConfigEnv implements IConfigService {
  get(key: string): string {
    const findEnv: string | undefined = process.env[key];
    if (!findEnv) {
      throw new Error('Пустая переменная');
    }
    return findEnv;
  }
}
