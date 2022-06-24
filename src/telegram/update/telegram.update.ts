import { On, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { TelegramService } from '../services/telegram/telegram.service';

@Update()
export class TelegramUpdate {
  constructor(private readonly telegramService: TelegramService) {}

  @On('message')
  async newChatMember(ctx: Context) {
    const cntx = ctx as any;
    try {
      return await this.telegramService.sendToMember(
        cntx.update.message.new_chat_member,
      );
    } catch (e) {
      console.log(e);
    }
  }
}
