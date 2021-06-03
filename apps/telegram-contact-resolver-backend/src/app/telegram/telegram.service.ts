import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { Message, User } from 'node-telegram-bot-api';
import { InjectRepository } from '@nestjs/typeorm';
import { TelegramUser } from '../shared/models/telegram-user.entity';
import { Between, Repository } from 'typeorm';
import { GroupEventEntry } from '../shared/models/group-event-entry.entity';
import { TelegramKeyboardMapperService } from './telegram-keyboard-mapper/telegram-keyboard-mapper.service';
import { GroupEventEntryMessage } from '../shared/models/group-event-entry-message.entity';
import { GroupMember } from '../shared/models/group-member.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramService {

  private bot: TelegramBot;

  constructor(@InjectRepository(TelegramUser) private telegramUserRepository: Repository<TelegramUser>,
              @InjectRepository(GroupEventEntry) private groupEventEntryRepository: Repository<GroupEventEntry>,
              @InjectRepository(GroupEventEntryMessage) private groupEventEntryMessageRepository: Repository<GroupEventEntryMessage>,
              private telegramKeyboardMapper: TelegramKeyboardMapperService,
              private configService: ConfigService) {
    this.bot = new TelegramBot(this.configService.get('telegram.token'), { polling: true });

    this.bot.on('message', (msg: Message) => {
      this.findByTelegramBotUser(msg.from)
        .then(() => {
          this.updateUser(msg.from, msg.chat.id);
          this.bot.sendMessage(msg.chat.id, 'Hallo, ich werde dir eine Nachricht senden, sobald deine Gruppenstunde beendet ist.');
        })
        .catch(() => {
          this.bot.sendMessage(msg.chat.id, `Tut mir leid, du bist kein Leiter von ${this.configService.get('general.name')}.`);
        });
    });

    this.bot.on('callback_query', async (query) => {
      const groupEventEntryMessage = await this.groupEventEntryMessageRepository.findOne({
        where: {
          messageId: query.message.message_id
        },
      });
      const groupEventEntry = groupEventEntryMessage.entry;
      if (groupEventEntry) {
        const selectedMember = groupEventEntry.groupEvent.members.find(member => member.id === +query.data);
        if (selectedMember) {
          const visitedMember = groupEventEntry.visitedGroupMembers.find(member => member.id === selectedMember.id);
          if (visitedMember) {
            groupEventEntry.visitedGroupMembers = groupEventEntry.visitedGroupMembers.filter(member => !(member.id === visitedMember.id));
          } else {
            groupEventEntry.visitedGroupMembers.push(selectedMember);
          }
          const savedGroupEventEntry = await this.groupEventEntryRepository.save(groupEventEntry);
          this.updateContactResolveMessage(savedGroupEventEntry);
        }
      }
      this.bot.answerCallbackQuery(query.id);
    });

  }

  private async findByTelegramBotUser(user: User): Promise<TelegramUser> {
    return this.telegramUserRepository.findOneOrFail({
      where: {
        username: user.username
      }
    });
  }

  private async updateUser(user: User, chatId: number): Promise<TelegramUser> {
    const telegramUser: TelegramUser = await this.findByTelegramBotUser(user);
    telegramUser.telegramId = user.id;
    telegramUser.chatId = chatId;

    return this.telegramUserRepository.save(telegramUser);
  }

  async sendContactResolveMessage(groupEventEntry: GroupEventEntry): Promise<void> {
    const leaders: TelegramUser[] = groupEventEntry.groupEvent.leaders;
    for (const leader of leaders) {
      const msg = await this.bot.sendMessage(leader.chatId, `${groupEventEntry.groupEvent.name} (${groupEventEntry.date.toLocaleDateString()})\n\nHallo ${leader.username}\nDeine Gruppenstunde vom ${groupEventEntry.date.toLocaleDateString()} ist soeben geendet. Bitte wähle aus, wer anwesend war:`, {
        reply_markup: this.telegramKeyboardMapper.mapGroupEventEntryToKeyboard(groupEventEntry)
      });
      if (!groupEventEntry.telegramMessages) {
        groupEventEntry.telegramMessages = [];
      }
      const groupEventEntryMessage = await this.groupEventEntryMessageRepository.create(
        new GroupEventEntryMessage(msg.chat.id, msg.message_id)
      );
      const savedGroupEventEntryMessage = await this.groupEventEntryMessageRepository.save(groupEventEntryMessage);
      groupEventEntry.telegramMessages.push(savedGroupEventEntryMessage);
    }
    this.groupEventEntryRepository.save(groupEventEntry);
  }

  async updateContactResolveMessage(groupEventEntry: GroupEventEntry): Promise<void> {
    const telegramMessages = await this.groupEventEntryMessageRepository.find({
      where: {
        entry: {
          id: groupEventEntry.id
        }
      }
    });
    telegramMessages.forEach((message: GroupEventEntryMessage) => {
      this.bot.editMessageReplyMarkup(this.telegramKeyboardMapper.mapGroupEventEntryToKeyboard(groupEventEntry), {
        message_id: message.messageId,
        chat_id: message.chatId
      });
    });
  }

  async sendWeeklyReport(startDate: Date, endDate: Date): Promise<void> {
    const groupEventEntries: GroupEventEntry[] = await this.groupEventEntryRepository.find({
      where: {
        date: Between(startDate, endDate)
      }
    });
    let message = `Hier ist der Wöchentliche Bericht von der Woche von ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}\n\n`;
    groupEventEntries.forEach((entry: GroupEventEntry) => {
      message = message + `${entry.groupEvent.name} (${entry.date.toLocaleDateString()})\nAnwesende Personen: ${entry.visitedGroupMembers.length}\n`;
      entry.visitedGroupMembers.forEach((member: GroupMember) => {
        message = message + `- ${member.firstName} ${member.lastName}\n`;
      });
      message = message + '\n\n';
    });
    const admins: TelegramUser[] = await  this.telegramUserRepository.find({
      where: {
        admin: true
      }
    });
    admins.forEach((admin: TelegramUser) => {
      this.bot.sendMessage(admin.chatId, message);
    });
  }
}
