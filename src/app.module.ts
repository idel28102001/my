import { Module } from '@nestjs/common';
import { TeleramModule } from './telegram/teleram.module';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { config } from './common/config';
import { session } from 'telegraf';

@Module({
  imports: [
    TeleramModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TelegrafModule.forRootAsync({
      useFactory: () => {
        return {
          token: config.telegramToken(),
          middlewares: [session()],
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
