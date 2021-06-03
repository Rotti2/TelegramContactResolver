import { Test, TestingModule } from '@nestjs/testing';
import { TelegramKeyboardMapperService } from './telegram-keyboard-mapper.service';

describe('TelegramKeyboardMapperService', () => {
  let service: TelegramKeyboardMapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelegramKeyboardMapperService],
    }).compile();

    service = module.get<TelegramKeyboardMapperService>(TelegramKeyboardMapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
