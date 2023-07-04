import 'dotenv/config';
import {WaterParser} from "./water.parser";

const waterParser = new WaterParser();

describe('test',  () => {
    const result = 'Work';

    it('test for test',  async () => {
        const testWord = await waterParser.getWaterInfo();
        console.log(testWord)
    })
})
