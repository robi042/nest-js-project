import { Test, TestingModule } from '@nestjs/testing';
import { CampaignManagementController } from './campaign-management.controller';

describe('CampaignManagementController', () => {
  let controller: CampaignManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignManagementController],
    }).compile();

    controller = module.get<CampaignManagementController>(CampaignManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
