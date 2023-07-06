import 'dotenv/config';
import {WaterParser} from './water.parser';

describe('Water parser tests', () => {

    it('Test to resolve parser', async () => {
        const waterParser = new WaterParser();
        await expect(waterParser.getWaterInfo()).resolves.toBeDefined();
    })
})