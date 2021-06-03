import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GroupEventEntry } from './group-event-entry.entity';

@Entity()
export class GroupEventEntryMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  chatId: number;

  @Column('int')
  messageId: number;

  @ManyToOne(() => GroupEventEntry, {
    eager: true
  })
  entry: GroupEventEntry;

  constructor(chatId?: number, messageId?: number) {
    this.chatId = chatId;
    this.messageId = messageId;
  }
}
