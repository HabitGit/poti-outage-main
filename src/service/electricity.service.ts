import {ElectricityParser} from "../parsers/electricity.parser";
import {Helper} from "./helper";
import TelegramBot from "node-telegram-bot-api";
import {IFinishParserInfo} from "../templates/interfaces";
import {Repository} from "typeorm";
import {Users} from "../db/entitys/users.entity";
import {AppDataSource} from "../db/data-source";
import {createClient} from "redis";

//Юзер репозиторий
const usersRepository: Repository<Users> = AppDataSource.getRepository(Users);

//Инициализация Redis
export const cacheClient = createClient({
    legacyMode: true,
    socket: {
        port: Number(process.env.REDIS_PORT_INSIDE),
        host: process.env.REDIS_HOST,
    },
});
cacheClient.on('error', err => console.log('Redis client Error', err));
cacheClient.connect().then(() => console.log('Redis connect'));

export class ElectricityService {
    constructor(
        private electricityParser: ElectricityParser,
        private helper: Helper,
    ) {}

    async cronGetElectricityInfo(bot: TelegramBot): Promise<string> {
        const info: Array<IFinishParserInfo> = await this.electricityParser.getElectricityInfo();
        const infoForOutput: string = this.electricityOutputInfo(info);
        let cache: string | null = await cacheClient.get('electricityInfo');
        await cacheClient.set('electricityInfo', infoForOutput, {EX: 7800});
        if ( cache ) return cache;
        if ( infoForOutput === 'Инфо об отключении электричества нет.' ) return infoForOutput;
        const chatIds: Users[] = await usersRepository.find({
            select: {
                chatId: true,
            },
        });
        for ( const chatId of chatIds ) {
            await bot.sendMessage(chatId.chatId, infoForOutput)
        }
        return infoForOutput;
    }

    private electricityOutputInfo(info: Array<IFinishParserInfo>): string {
        if ( info.length === 0 ) return 'Инфо об отключении электричества нет.'
        return this.helper.infoOutputRefactoring(info);
    }
}