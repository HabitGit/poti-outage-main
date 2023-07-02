import {Repository} from "typeorm";
import {Users} from "../db/entitys/users.entity";
import {AppDataSource} from "../db/data-source";
import {createClient} from "redis";
import TelegramBot from "node-telegram-bot-api";
import {WaterParser} from "../parsers/water.parser";
import {Helper} from "./helper";
import {IFinishParserInfo} from "../templates/interfaces";

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

export class WaterService {
    constructor(
        private waterParser: WaterParser,
        private helper: Helper,
    ) {}

    async cronGetWaterInfo(bot: TelegramBot): Promise<string> {
        const info: Array<IFinishParserInfo> = await this.waterParser.getWaterInfo()
        const infoForOutput: string = this.waterOutputInfo(info);
        let cache: string | null = await cacheClient.get('waterInfo');
        await cacheClient.set('waterInfo', infoForOutput, {EX: 7800});
        if ( cache ) return cache;
        if ( infoForOutput === 'Инфо об отключении воды нет.' ) return infoForOutput;
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

    private waterOutputInfo(info: Array<IFinishParserInfo>): string {
        if ( info.length === 0 ) return 'Инфо об отключении воды нет.';
        return this.helper.infoOutputRefactoring(info);
    }
}