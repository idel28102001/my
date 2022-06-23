import { Injectable, UnauthorizedException } from '@nestjs/common';
import { StringSession } from 'telegram/sessions';
import { TelegramClient } from 'telegram';
import { Telegraf } from 'telegraf';
import * as fs from 'fs';
import * as path from 'path';
import * as BigInt from 'big-integer';

@Injectable()
export class TelegramService {
  readonly bot: Telegraf;

  constructor() {
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

  async sendToMember(member) {
    const chat = process.env.CHAT;
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
    const link = await this.bot.telegram.createChatInviteLink(chat, {
      name: `${member.first_name}${member.last_name || ''}-${member.id}`,
    });
    const second = `${textJson.second}\n\n${link.invite_link}\n\nвступить в её группу`;
    const third = textJson.third;

    const client = await this.getTelegramClient(process.env.SESSION_HASH);
    const id = member.id;
    const aaa = BigInt(id.toString());
    await client.sendMessage(aaa, {
      message: first,
      parseMode: 'html',
    });

    await client.sendMessage(aaa, {
      message: second,
      parseMode: 'html',
    });
    await client.sendMessage(aaa, {
      message: third,
      parseMode: 'html',
    });
  }
}
