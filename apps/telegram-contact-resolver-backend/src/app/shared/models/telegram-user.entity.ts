import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GroupEvent } from './group-event.entity';

@Entity()
export class TelegramUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', {
    nullable: true,
    unique: true
  })
  telegramId: number;

  @Column('int', {
    nullable: true
  })
  chatId: number;

  @Column('varchar', {
    unique: true
  })
  username: string;

  @ManyToMany(() => GroupEvent)
  groupEvents: GroupEvent[];

  @Column('boolean')
  admin: boolean;
}
