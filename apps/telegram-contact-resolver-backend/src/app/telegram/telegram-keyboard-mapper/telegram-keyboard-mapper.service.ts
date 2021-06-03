import { Injectable } from '@nestjs/common';
import { GroupEventEntry } from '../../shared/models/group-event-entry.entity';
import { InlineKeyboardMarkup } from 'node-telegram-bot-api';
import { GroupMember } from '../../shared/models/group-member.entity';

@Injectable()
export class TelegramKeyboardMapperService {
  mapGroupEventEntryToKeyboard(groupEventEntry: GroupEventEntry): InlineKeyboardMarkup {
    return {
      inline_keyboard: groupEventEntry.groupEvent.members.map((member: GroupMember) => {
        let text = '';
        if (
          groupEventEntry.visitedGroupMembers &&
          groupEventEntry.visitedGroupMembers?.findIndex((visitedMember: GroupMember) => visitedMember.id === member.id) !== -1
        ) {
          text = '✅ ';
        }

        text = text + member.firstName + ' ' + member.lastName;
        return [
          { text, callback_data: member.id + '' }
        ];
      })
    };
  }
}
