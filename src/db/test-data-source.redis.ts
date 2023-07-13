import { createClient } from 'redis';

export const cacheClient = createClient({
  url: 'redis://@localhost:6378',
});

cacheClient.on('error', err => console.log('Redis client Error', err));
cacheClient.connect().then(() => console.log('Redis connect'));