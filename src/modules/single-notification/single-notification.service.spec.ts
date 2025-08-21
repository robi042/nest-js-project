import { Test, TestingModule } from '@nestjs/testing';
import { SingleNotificationService } from './single-notification.service';

describe('SingleNotificationService', () => {
  let service: SingleNotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SingleNotificationService],
    }).compile();

    service = module.get<SingleNotificationService>(SingleNotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
