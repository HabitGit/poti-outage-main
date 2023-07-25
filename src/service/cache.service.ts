import { RedisClientType } from 'redis';
import { IGetInfo } from '../templates/interfaces/interfaces';

export class CacheService {
  client: RedisClientType;

  constructor(clientService: RedisClientType) {
    this.client = clientService;
  }

  async set(key: string, value: string, ex: number) {
    return this.client.set(key, value, { EX: ex });
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async keys(keys: string) {
    return this.client.keys(keys);
  }

  async mGet(keys: string[]) {
    return this.client.mGet(keys);
  }

  async getWaterInfo(waterInfo: IGetInfo) {
    const nowDateTimestamp: number = Date.now();
    const endDateTimestamp: number = waterInfo.endDate.getTime();
    const timeToKeyLife: number = +Math.round(
      (endDateTimestamp - nowDateTimestamp) / 1000,
    );
    const key: string = `waterInfo${endDateTimestamp}`;
    const cache: string | null = await this.get(key);
    await this.set(key, waterInfo.message, timeToKeyLife);
    return cache;
  }

  async getElectricityInfo(waterInfo: IGetInfo) {
    const nowDateTimestamp: number = Date.now();
    const endDateTimestamp: number = waterInfo.endDate.getTime();
    const timeToKeyLife: number = +Math.round(
      (endDateTimestamp - nowDateTimestamp) / 1000,
    );
    const key: string = `electricityInfo${endDateTimestamp}`;
    const cache: string | null = await this.get(key);
    await this.set(key, waterInfo.message, timeToKeyLife);
    return cache;
  }
}