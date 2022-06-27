import { On, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { TelegramService } from '../services/telegram/telegram.service';

@Update()
export class TelegramUpdate {
  constructor(private readonly telegramService: TelegramService) {}

  private i = 0;

  @On('new_chat_members')
  async newChatMember(ctx: Context) {
    const IDS = [
      process.env.SESSION_HASH1,
      process.env.SESSION_HASH2,
      process.env.SESSION_HASH3,
    ];
    const cntx = ctx as any;
    try {
      await this.telegramService.sendToMember(
        cntx.update.message.new_chat_member,
        IDS[this.i],
      );
      this.i = ++this.i % IDS.length;
      return;
    } catch (e) {
      if (e.errorMessage === 'PEER_FLOOD') {
        this.i = ++this.i % IDS.length;
        await this.newChatMember(ctx);
      } else {
        console.log(e);
      }
    }
  }
}
