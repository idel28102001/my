import { Module } from '@nestjs/common';
import { TelegramService } from './services/telegram/telegram.service';
import { TelegramUpdate } from './update/telegram.update';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [TelegramService, TelegramUpdate],
  exports: [TelegramService],
})
export class TeleramModule {}
