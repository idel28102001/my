import { On, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { TelegramService } from '../services/telegram/telegram.service';

@Update()
export class TelegramUpdate {
  constructor(private readonly telegramService: TelegramService) {}

  @On('new_chat_members')
  async newChatMember(ctx: Context) {
    const cntx = ctx as any;
    return await this.telegramService.sendToMember(
      cntx.update.message.new_chat_members[0],
    );
  }
}
