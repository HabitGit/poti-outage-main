// import { testCacheClient } from '../db/test-data-source.redis';
//
// describe('Cache testing', () => {
//   afterAll(async () => {
//     await testCacheClient.del('test');
//     await testCacheClient.quit();
//   });
//
//   it('Test to Redis working', async () => {
//     await testCacheClient.set('test', 'work');
//     const cache = await testCacheClient.get('test');
//     expect(cache).toBe('work');
//   });
// });
