import { Injectable, UnauthorizedException } from '@nestjs/common';
import { StringSession } from 'telegram/sessions';
import { Api, TelegramClient } from 'telegram';
import { Context, Telegraf } from 'telegraf';
import * as fs from 'fs';
import * as path from 'path';
import { UsersService } from '../../../users/services/users.service';
import { UserEntity } from '../../../users/entities/users.entity';
import { RolesEnum } from '../../../users/enums/roles.enum';
import * as bigInteger from 'big-integer';

@Injectable()
export class TelegramService {
  readonly bot = new Telegraf(process.env.TOKEN);

  constructor(private readonly usersService: UsersService) {}

  async registerBot() {
    const client = new TelegramClient(
      new StringSession(''),
      Number(process.env.TELEGRAM_API_ID),
      process.env.TELEGRAM_API_HASH,
      { connectionRetries: 5 },
    );
    await client.start({ botAuthToken: process.env.TOKEN });
    return client.session.save();
  }

  // async sendMessageToChannel(
  //   dates: SignupsEntity[],
  //   date: string,
  //   messageId: null | number,
  // ) {
  //   const text = `${date}\n\n`;
  //   const texts = dates.map((e) => {
  //     const user = e.user
  //       ? `@${e.user.username}` || e.user.firstname || 'занято'
  //       : 'свободно';
  //     const type = SignupsNamesEnum[e.type];
  //     const time = getMainTime(e.date);
  //     return `${time} - ${type}: ${user}`;
  //   });
  //   const message = `${text}${texts.join('\n')}`;
  //   const schedule = getUnixTime(
  //     new Date(`${getMainDate(dates[0].date)} 08:00`),
  //   );
  //   const client = await this.getTelegramClient(process.env.SESSION);
  //   await client.connect();
  //   const peer = await client.getEntity(process.env.CHAT);
  //   if (!messageId) {
  //     await client.sendMessage(peer, {
  //       message,
  //       schedule,
  //     });
  //   } else {
  //     await client.editMessage(peer, {
  //       message: messageId,
  //       text: message,
  //       schedule,
  //     });
  //   }
  // }

  async getTelegramBot(stringSession: string) {
    const apiId = Number(process.env.TELEGRAM_API_ID);
    const apiHash = process.env.TELEGRAM_API_HASH;
    return new TelegramClient(
      new StringSession(stringSession),
      apiId,
      apiHash,
      {
        // Создаем клиента
        connectionRetries: 5,
      },
    );
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

  async saveToDBMember(member, link?) {
    return await this.saveToDB({
      username: member.username,
      lastname: member.last_name,
      firstname: member.first_name,
      telegramId: member.id.toString(),
      referallink: link,
    });
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
    await this.saveToDBMember(member, link.invite_link);
    const third = textJson.third;
    await ctx.reply(first);
    await ctx.reply(second);
    await ctx.reply(third);
  }

  async handleMember(ctx: Context) {
    const cntx = ctx as any;
    if (!cntx.startPayload) {
      await this.sendToMember(ctx);
    } else {
      await this.sendGift(ctx);
    }
  }

  async sendGift(ctx) {
    const client = await this.getTelegramClient(process.env.BOT_SESSION);
    // const currPath = path.join(__dirname, '../../../../folders/gift.mp3');
    const member = ctx.update.message.from;
    const user = await this.usersService.findByTelegramId(member.id);
    if (!user) {
      await this.saveToDB(member);
    }
    const fromId = ctx.update.message.from.id;
    const toId = await client.getEntity(fromId);
    const result = JSON.parse(fs.readFileSync('some').toString());
    const aaabbb = new Api.InputDocument({
      id: bigInteger(result.id),
      fileReference: Buffer.from(result.fileReference),
      accessHash: bigInteger(result.accessHash),
    });
    await client.sendFile(toId, {
      file: new Api.InputMediaDocument({ id: aaabbb }),
      caption: 'Утренняя медитация - создай своё тело мечты',
    });
    await ctx.reply(
      'Ссылка на чат для большего!\nhttps://t.me/+AOOEoajx_2llMGI6',
    );
    // await client.sendFile(peerId, {
    //   caption: 'Подарок',
    //   file: new Api.InputMediaDocument({ id: aaabbb }),
    // });
    // console.log(fromId);
    // const file = new CustomFile({});
    // const result = client.uploadFile({ workers: 1, file });
    // console.log(result.media.document);
  }

  async signUp(ctx: Context) {
    const cntx = ctx as any;
    const member = cntx.update.message.from;
    let user = await this.usersService.findByTelegramId(member.id);
    if (!user) {
      user = await this.saveToDBMember(member);
    }
    switch (user.role) {
      case RolesEnum.ADMIN: {
        await cntx.scene.enter('sign-up-for-admin');
        break;
      }
      case RolesEnum.USER: {
        await ctx.reply('Получение списка в разработке - ждите');
        break;
      }
    }
  }

  async makeMeAdmin(ctx: Context) {
    const cntx = ctx as any;
    const member = cntx.update.message.from;
    const user = await this.usersService.findByTelegramId(member.id.toString());
    if (!user) {
      await this.saveToDB({
        username: member.username,
        lastname: member.last_name,
        firstname: member.first_name,
        telegramId: member.id.toString(),
      });
    }
    await cntx.scene.enter('make-me-admin');
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
