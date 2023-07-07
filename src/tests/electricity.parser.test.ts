import 'dotenv/config';
import {ElectricityParser} from "../parsers/electricity.parser";
import { Helper } from '../service/helper';

describe('Testing electricity parser', () => {
    it('Test to resolve parser', async () => {
        const helper = new Helper()
        const electricityParser = new ElectricityParser(helper);
        await expect(electricityParser.getElectricityInfo()).resolves.toBeDefined();
    })
})