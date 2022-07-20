import { On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { TelegramService } from '../services/telegram/telegram.service';

@Update()
export class TelegramUpdate {
  constructor(private readonly telegramService: TelegramService) {}

  @On('new_chat_members')
  async newChatMember(ctx: Context) {
    const cntx = ctx as any;
    const message = cntx.update.message;
    const text = message.new_chat_member.username
      ? `@${message.new_chat_member.username}`
      : 'Новый участник';
    const mess = await ctx.reply(
      `Добрый день, ${text}! Перейдите в бота @${process.env.BOT_USERNAME}, чтобы получить свою собственную реферальную ссылку.`,
      {
        disable_notification: true,
      },
    );
    try {
      setTimeout(async () => {
        await ctx.telegram.deleteMessage(mess.chat.id, mess.message_id);
      }, 15 * 1000);
    } catch (e) {
      console.error(e);
    }
  }

  @Start()
  async start(ctx: Context) {
    await this.telegramService.handleMember(ctx);
  }

  // @Command('/makemeadmin')
  // async makeMeAdmin(ctx: Context) {
  //   await this.telegramService.makeMeAdmin(ctx);
  // }
  //
  // @Command('/signup')
  // async signUp(ctx: Context) {
  //   await this.telegramService.signUp(ctx);
  // }
}
