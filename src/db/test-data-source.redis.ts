import { createClient, RedisClientType } from 'redis';

export const testCacheClient: RedisClientType = createClient({
  url: 'redis://@localhost:6378',
});

testCacheClient.on('error', (err) => console.log('Redis client Error', err));
testCacheClient.connect().then(() => console.log('Redis connect'));
