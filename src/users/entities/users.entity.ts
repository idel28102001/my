import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RolesEnum } from '../enums/roles.enum';
import { SignupsEntity } from '../../signups/entities/signups.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn({ nullable: true })
  createdAt: number;

  @Column({ nullable: false, unique: true })
  telegramId: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  firstname: string;

  @Column({ nullable: true })
  lastname: string;

  @Column({ nullable: true })
  referallink: string;

  @Column({ default: RolesEnum.USER })
  role: string;

  @OneToMany(() => SignupsEntity, (signups) => signups.user)
  signups: SignupsEntity[];
}
