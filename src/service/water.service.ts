import {Repository} from "typeorm";
import {Users} from "../db/entitys/users.entity";
import {AppDataSource} from "../db/data-source";
import TelegramBot from "node-telegram-bot-api";
import {WaterParser} from "../parsers/water.parser";
import {Helper} from "./helper";
import {IFinishParserInfo} from "../templates/interfaces";
import {cacheClient} from "../db/data-source.redis";

//Юзер репозиторий
const usersRepository: Repository<Users> = AppDataSource.getRepository(Users);

export class WaterService {
    constructor(
        private waterParser: WaterParser,
        private helper: Helper,
    ) {}

    async cronGetWaterInfo(bot: TelegramBot) {
        const info: Array<IFinishParserInfo> = await this.waterParser.getWaterInfo()
        const infoForOutput: string = this.waterOutputInfo(info);

        const cache: string | null = await cacheClient.get('waterInfo');
        await cacheClient.set('waterInfo', infoForOutput, {EX: 7800});

        if ( infoForOutput === 'Инфо об отключении воды нет.' ) return;
        if ( infoForOutput !== cache ) {
            const chatIds: Users[] = await usersRepository.find({
                select: {
                    chatId: true,
                },
            });
            for ( const chatId of chatIds ) {
                try {
                    await bot.sendMessage(chatId.chatId, infoForOutput)
                } catch (e) {
                    console.log(e)
                }
            }
            return;
        }
    }

    private waterOutputInfo(info: Array<IFinishParserInfo>): string {
        if ( info.length === 0 ) return 'Инфо об отключении воды нет.';
        return this.helper.infoOutputRefactoring(info);
    }
}