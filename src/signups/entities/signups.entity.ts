import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/users.entity';
import { SignupsEnum } from '../enums/signups.enum';

@Entity('signups')
export class SignupsEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column()
  type: SignupsEnum;

  @ManyToOne(() => UserEntity, (user) => user.signups)
  user: UserEntity;

  @Column({ nullable: true })
  messageId: number;
}
