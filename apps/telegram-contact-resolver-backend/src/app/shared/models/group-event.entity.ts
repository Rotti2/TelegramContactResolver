import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TelegramUser } from './telegram-user.entity';
import { GroupMember } from './group-member.entity';

@Entity()
export class GroupEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @Column('varchar')
  cronExpression: string;

  @ManyToMany(() => TelegramUser, {
    eager: true
  })
  @JoinTable()
  leaders: TelegramUser[];

  @OneToMany(() => GroupMember, member => member.group, {
    eager: true
  })
  members: GroupMember[];
}
