import { Test, TestingModule } from '@nestjs/testing';
import { GroupEventScheduleService } from './group-event-schedule.service';

describe('GroupEventScheduleService', () => {
  let service: GroupEventScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupEventScheduleService],
    }).compile();

    service = module.get<GroupEventScheduleService>(GroupEventScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
