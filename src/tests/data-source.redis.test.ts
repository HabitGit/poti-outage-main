import {createClient} from "redis";

const cacheClient = createClient({
    url: 'redis://@localhost:6378',
});
cacheClient.on('error', err => console.log('Redis Client Error', err))
cacheClient.connect();
describe('Cache testing', () => {

    afterAll(async () => {
        await cacheClient.del('test');
    })

    it('Test to Redis working', async () => {
        await cacheClient.set('test', 'work');
        const cache = await cacheClient.get('test');
        expect(cache).toBe('work')
    })
})