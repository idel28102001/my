import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
  ) {}

  async save(elems) {
    return await this.usersRepo.save(elems);
  }

  create(elems) {
    return this.usersRepo.create(elems);
  }

  async findByTelegramId(id: string) {
    return await this.usersRepo.findOne({ where: { telegramId: id } });
  }
}
