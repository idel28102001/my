import { Module } from '@nestjs/common';
import { TelegramService } from './services/telegram/telegram.service';
import { TelegramUpdate } from './update/telegram.update';
import { UsersModule } from '../users/users.module';
import { MakeMeAdminWizard } from './wizards/make-me-admin.wizard';
import { SignUpForAdminWizard } from './wizards/sign-up-for-admin.wizard';
import { SignupsModule } from '../signups/signups.module';
import { TelegramController } from './controllers/telegram.controller';

@Module({
  imports: [UsersModule, SignupsModule],
  providers: [
    TelegramService,
    TelegramUpdate,
    MakeMeAdminWizard,
    SignUpForAdminWizard,
  ],
  exports: [TelegramService],
  controllers: [TelegramController],
})
export class TeleramModule {}
