import { IConfigService } from './config.interface';
import process from 'node:process';

export class ConfigService implements IConfigService {
  get(key: string): string {
    const findEnv: string | undefined = process.env[key];
    if (!findEnv) {
      throw new Error('Пустая переменная');
    }
    return findEnv;
  }
}
