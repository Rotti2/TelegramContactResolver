import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramUser } from '../shared/models/telegram-user.entity';
import { TelegramKeyboardMapperService } from './telegram-keyboard-mapper/telegram-keyboard-mapper.service';
import { GroupEventEntry } from '../shared/models/group-event-entry.entity';
import { GroupEvent } from '../shared/models/group-event.entity';
import { GroupMember } from '../shared/models/group-member.entity';
import { GroupEventEntryMessage } from '../shared/models/group-event-entry-message.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([TelegramUser, GroupEventEntry, GroupEvent, GroupMember, GroupEventEntryMessage]),
    ConfigModule
  ],
  providers: [TelegramService, TelegramKeyboardMapperService],
  exports: [TelegramService]
})
export class TelegramModule {}
