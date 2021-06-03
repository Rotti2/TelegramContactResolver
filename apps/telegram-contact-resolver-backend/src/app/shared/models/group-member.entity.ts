import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GroupEvent } from './group-event.entity';
import { GroupEventEntry } from './group-event-entry.entity';

@Entity()
export class GroupMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  firstName: string;

  @Column('varchar')
  lastName: string;

  @ManyToOne(() => GroupEvent)
  group: GroupEvent;

  @ManyToMany(() => GroupEventEntry)
  visitedGroupEvents: GroupEventEntry[];
}
