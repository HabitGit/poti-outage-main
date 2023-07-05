import 'dotenv/config';
import {ElectricityParser} from "./electricity.parser";

describe('Testing electricity parser', () => {
    it('Test to resolve parser', async () => {
        const electricityParser = new ElectricityParser();
        await expect(electricityParser.getElectricityInfo()).resolves.toBeDefined();
    })
})