import { Module } from '@nestjs/common';
import { TelegramService } from './services/telegram/telegram.service';
import { TelegramUpdate } from './update/telegram.update';

@Module({
  providers: [TelegramService, TelegramUpdate],
  exports: [TelegramService],
})
export class TeleramModule {}
