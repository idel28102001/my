import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { TelegramService } from '../services/telegram/telegram.service';
import * as fs from 'fs';
import { Api } from 'telegram';
import * as bigInteger from 'big-integer';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async uploadFile(@UploadedFile() aud: Express.Multer.File) {
    const client = await this.telegramService.getTelegramBot(
      process.env.BOT_SESSION,
    );
    await client.connect();

    const result = JSON.parse(fs.readFileSync('some').toString());
    const aaabbb = new Api.InputDocument({
      id: bigInteger(result.id),
      fileReference: Buffer.from(result.fileReference),
      accessHash: bigInteger(result.accessHash),
    });
    console.log(result, aaabbb);
    // console.log(aaa, filess, filess.document);
    const peerId = await client.getEntity(717950132);
    console.log(await client.getMe());
    await client.sendFile(peerId, {
      caption: 'Подарок',
      file: new Api.InputMediaDocument({ id: aaabbb }),
    });
    // await client.invoke(
    //   new Api.messages.SendMedia({
    //     peer: peerId,
    //     message: '',
    //     media: new Api.InputMediaDocument({ id: aaa }),
    //   }),
    // );
    // await client.invoke(
    //   new Api.messages.SendMessage({
    //     peer: peerId,
    //     message: 'dasas',
    //     // media: new Api.InputMediaDocument({ id: aaa }),
    //   }),
    // );
    // }
  }
}
