import { createClient, RedisClientType } from 'redis';

export const cacheClient: RedisClientType = createClient({
  url: 'redis://@redis:6379',
});

cacheClient.on('error', (err) => console.log('Redis client Error', err));
cacheClient.connect().then(() => console.log('Redis connect'));
