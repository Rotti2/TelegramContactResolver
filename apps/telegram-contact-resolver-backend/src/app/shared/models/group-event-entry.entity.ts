import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GroupEvent } from './group-event.entity';
import { GroupMember } from './group-member.entity';
import { GroupEventEntryMessage } from './group-event-entry-message.entity';

@Entity()
export class GroupEventEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('datetime')
  date: Date;

  @OneToMany(() => GroupEventEntryMessage, entry => entry.entry)
  telegramMessages: GroupEventEntryMessage[];

  @ManyToOne(() => GroupEvent, {
    eager: true
  })
  groupEvent: GroupEvent;

  @ManyToMany(() => GroupMember, member => member.visitedGroupEvents, {
    eager: true
  })
  @JoinTable()
  visitedGroupMembers: GroupMember[];

  constructor(groupEvent?: GroupEvent, date?: Date) {
    if (groupEvent) {
      this.groupEvent = groupEvent;
    }
    if (date) {
      this.date = date;
    }
  }
}
