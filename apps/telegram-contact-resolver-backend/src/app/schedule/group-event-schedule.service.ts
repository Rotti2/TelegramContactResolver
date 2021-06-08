import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupEvent } from '../shared/models/group-event.entity';
import { Repository } from 'typeorm';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { TelegramService } from '../telegram/telegram.service';
import { GroupEventEntry } from '../shared/models/group-event-entry.entity';

@Injectable()
export class GroupEventScheduleService {
  constructor(@InjectRepository(GroupEvent) private groupEventRepository: Repository<GroupEvent>,
              @InjectRepository(GroupEventEntry) private groupEventEntryRepository: Repository<GroupEventEntry>,
              private schedulerRegistry: SchedulerRegistry,
              private telegramService: TelegramService) {
    this.setup();
  }

  private async setup(): Promise<void> {
    const groupEvents: GroupEvent[] = await this.groupEventRepository.find();
    groupEvents.forEach((groupEvent: GroupEvent) => {
      const job = new CronJob(groupEvent.cronExpression, () => {
        this.resolveContacts(groupEvent, new Date(), job.nextDate().toDate());
      });
      this.schedulerRegistry.addCronJob(groupEvent.name, job);
      job.start();
      Logger.log('Registered CronJob for ' + groupEvent.name + ' | Next execution: ' + job.nextDate().toDate().toLocaleString(), 'GroupEventSchedule');
    });
  }

  private async resolveContacts(groupEvent: GroupEvent, date: Date, nextExecution: Date): Promise<void> {
    Logger.log(`Resolving Contacts for ${groupEvent.name}. Writing message to ${groupEvent.leaders.map(l => l.username).toString()}`, 'GroupEventSchedule');
    Logger.log(`Next Schedule for ${groupEvent.name}: ${nextExecution.toLocaleString()}`, 'GroupEventSchedule');
    const groupEventEntry: GroupEventEntry = new GroupEventEntry(groupEvent, date);
    const createdGroupEventEntry = await this.groupEventEntryRepository.create(groupEventEntry);
    const savedGroupEventEntry = await this.groupEventEntryRepository.save(createdGroupEventEntry);
    this.telegramService.sendContactResolveMessage(savedGroupEventEntry);
  }

  @Cron('0 0 12 * * SUN *')
  handleWeeklyCron(): void {
    const today = new Date();
    const aWeekAgo = new Date();
    aWeekAgo.setTime(aWeekAgo.getTime() - 24 * 60 * 60 * 1000 * 7);
    aWeekAgo.setHours(0, 0, 0);

    this.telegramService.sendWeeklyReport(aWeekAgo, today);
  }
}
