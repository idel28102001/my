import { Module } from '@nestjs/common';
import { SignupsService } from './services/signups.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignupsEntity } from './entities/signups.entity';

@Module({
  providers: [SignupsService],
  imports: [TypeOrmModule.forFeature([SignupsEntity])],
  exports: [SignupsService],
})
export class SignupsModule {}
