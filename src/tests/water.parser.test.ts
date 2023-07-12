import 'dotenv/config';
import { WaterParser } from '../parsers/water.parser';
import { Helper } from '../service/helper';

describe('Water parser tests', () => {

  it('Test to resolve parser', async () => {
    const helper = new Helper();
    const waterParser = new WaterParser(helper);
    await expect(waterParser.getWaterInfo()).resolves.toBeDefined();
  });
});