import { createClient } from 'redis';

export const testCacheClient = createClient({
  url: 'redis://@localhost:6378',
});

testCacheClient.on('error', (err) => console.log('Redis client Error', err));
testCacheClient.connect().then(() => console.log('Redis connect'));
