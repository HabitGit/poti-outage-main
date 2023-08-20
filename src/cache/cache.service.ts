import { RedisClientType } from 'redis';
import { IGetOutageInfo } from '../templates/interfaces/interfaces';

export class CacheService {
  client: RedisClientType;

  constructor(clientService: RedisClientType) {
    this.client = clientService;
  }

  async set(key: string, value: string, ex: number): Promise<string | null> {
    return this.client.set(key, value, { EX: ex });
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async keys(keys: string): Promise<string[]> {
    return this.client.keys(keys);
  }

  async mGet(keys: string[]): Promise<(string | null)[]> {
    return this.client.mGet(keys);
  }

  async getCacheInfo(outageInfo: IGetOutageInfo): Promise<string | null> {
    const nowDateTimestamp: number = Date.now();
    const endDateTimestamp: number = outageInfo.endDate.getTime();

    const timeToKeyLife: number = +Math.round(
      (endDateTimestamp - nowDateTimestamp) / 1000,
    );
    if (timeToKeyLife <= 0) {
      throw new Error('Old value');
    }
    const key: string = `${
      outageInfo.name === 'воды' ? 'waterInfo' : 'electricityInfo'
    }${outageInfo.streets}${endDateTimestamp}`;

    const cache: string | null = await this.get(key);
    await this.set(key, outageInfo.message, timeToKeyLife);
    return cache;
  }
}
