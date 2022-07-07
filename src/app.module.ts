import { Module } from '@nestjs/common';
import { TeleramModule } from './telegram/teleram.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { config } from './common/config';
import { session } from 'telegraf';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TeleramModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('POSTGRES_HOST'),
        port: Number(config.get('POSTGRES_PORT')),
        username: config.get('POSTGRES_USER'),
        password: config.get('POSTGRES_PASSWORD'),
        database: config.get('POSTGRES_DB'),
        entities: [__dirname + '/**/**/**.entity{.ts,.js}'],
        synchronize: true,
        migrationsRun: false,
        logging: false,
      }),
      inject: [ConfigService],
    }),
    TelegrafModule.forRootAsync({
      useFactory: () => {
        return {
          token: config.telegramToken(),
          middlewares: [session()],
        };
      },
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
