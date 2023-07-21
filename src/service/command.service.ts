import { Users } from '../db/entitys/users.entity';
import { UsersRepository } from '../db/repository/users.repository';
import { SocialService } from './social.service';

export class CommandService {
  constructor(
    private usersRepository: UsersRepository,
    private socialService: SocialService,
  ) {}

  async start(chatId: number, userName: string, userId: number) {
    const isUser: Users | null = await this.usersRepository.getUserByUserId(
      userId,
    );

    return isUser
      ? this.socialService.welcomeBack(chatId, userName)
      : this.socialService.welcome(chatId, userName);
  }
}
