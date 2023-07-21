import { RedisClientType } from 'redis';

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
}
