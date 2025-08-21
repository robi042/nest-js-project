import { Test, TestingModule } from '@nestjs/testing';
import { SingleNotificationController } from './single-notification.controller';

describe('SingleNotificationController', () => {
  let controller: SingleNotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SingleNotificationController],
    }).compile();

    controller = module.get<SingleNotificationController>(SingleNotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
