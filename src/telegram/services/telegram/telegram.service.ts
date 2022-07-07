import { Injectable, UnauthorizedException } from '@nestjs/common';
import { StringSession } from 'telegram/sessions';
import { TelegramClient } from 'telegram';
import { Telegraf } from 'telegraf';
import * as fs from 'fs';
import * as path from 'path';
import { Context } from 'vm';
import { UsersService } from '../../../users/services/users.service';
import { UserEntity } from '../../../users/entities/users.entity';

@Injectable()
export class TelegramService {
  readonly bot: Telegraf;

  constructor(private readonly usersService: UsersService) {
    this.bot = new Telegraf(process.env.TOKEN);
  }

  async getTelegramClient(session = '') {
    const apiId = Number(process.env.TELEGRAM_API_ID);
    const apiHash = process.env.TELEGRAM_API_HASH;
    const stringSession = new StringSession(session); // Создаём сессию
    const client = new TelegramClient(stringSession, apiId, apiHash, {
      // Создаем клиента
      connectionRetries: 5,
    });
    await client.connect(); // Конектимся
    if (!(await client.checkAuthorization()) && session) {
      // Проверяем - действительна ли сессия
      throw new UnauthorizedException('Сессия недействительна');
    }
    return client; // Возвращаем
  }

  async sensWholeMessage(ctx: Context, member) {
    let name = member.first_name;
    if (/[\d\.\-A-z]/.test(name)) {
      name = 'Здравствуйте!';
    } else {
      name = `Здравствуйте, ${name}!`;
    }
    const textJson = JSON.parse(
      fs
        .readFileSync(path.join(__dirname, '../../../../', 'texts/text.json'))
        .toString(),
    );
    const first = `${name}\n${textJson.first}`;
    const link = await this.bot.telegram.createChatInviteLink(
      process.env.CHAT,
      {
        name: `${member.first_name}${member.last_name || ''}-(${member.id})`,
      },
    );
    const second = `${textJson.second}\n\n${link.invite_link}\n\nвступить в её группу`;
    await this.saveToDB({
      username: member.username,
      lastname: member.last_name,
      firstname: member.first_name,
      telegramId: member.id.toString(),
      referallink: link.invite_link,
    });
    const third = textJson.third;
    await ctx.reply(first);
    await ctx.reply(second);
    await ctx.reply(third);
  }

  async saveToDB(elem) {
    const elems = this.usersService.create(elem);
    return await this.usersService.save(elems);
  }

  async sendToMember(ctx: Context) {
    const cntx = ctx as any;
    const member = cntx.update.message.from;
    const user = await this.checkIfInBase(member);
    if (user) {
      return await this.sendRefLinkAgain(ctx, user);
    } else {
      return await this.sensWholeMessage(ctx, member);
    }
  }

  async sendRefLinkAgain(ctx: Context, user: UserEntity) {
    const referalLink = user.referallink;
    await ctx.reply(`Вы уже имеете свою реферальную ссылку - ${referalLink}`);
  }

  async checkIfInBase(member) {
    return await this.usersService.findByTelegramId(member.id.toString());
  }
}
