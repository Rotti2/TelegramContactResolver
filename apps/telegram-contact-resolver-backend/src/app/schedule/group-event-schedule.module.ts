import { Module } from '@nestjs/common';
import { GroupEventScheduleService } from './group-event-schedule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEvent } from '../shared/models/group-event.entity';
import { TelegramModule } from '../telegram/telegram.module';
import { GroupEventEntry } from '../shared/models/group-event-entry.entity';
import { GroupMember } from '../shared/models/group-member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupEvent, GroupEventEntry, GroupMember]),
    TelegramModule
  ],
  providers: [GroupEventScheduleService]
})
export class GroupEventScheduleModule {}
