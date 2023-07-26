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

  async getWaterInfo(waterInfo: IGetInfo): Promise<string | null> {
    const nowDateTimestamp: number = Date.now();
    const endDateTimestamp: number = waterInfo.endDate.getTime();

    const timeToKeyLife: number = +Math.round(
      (endDateTimestamp - nowDateTimestamp) / 1000,
    );
    if (timeToKeyLife <= 0) {
      return 'old value';
    }
    const key: string = `waterInfo${waterInfo.streets}${endDateTimestamp}`;
    const cache: string | null = await this.get(key);
    await this.set(key, waterInfo.message, timeToKeyLife);
    return cache;
  }

  async getElectricityInfo(electricityInfo: IGetInfo) {
    const nowDateTimestamp: number = Date.now();
    const endDateTimestamp: number = electricityInfo.endDate.getTime();

    const timeToKeyLife: number = +Math.round(
      (endDateTimestamp - nowDateTimestamp) / 1000,
    );
    if (timeToKeyLife <= 0) {
      return 'old value';
    }
    const key: string = `electricityInfo${electricityInfo.streets}${endDateTimestamp}`;
    const cache: string | null = await this.get(key);
    await this.set(key, electricityInfo.message, timeToKeyLife);
    return cache;
  }
}
