import { Test, TestingModule } from '@nestjs/testing';
import { CampaignManagementService } from './campaign-management.service';

describe('CampaignManagementService', () => {
  let service: CampaignManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CampaignManagementService],
    }).compile();

    service = module.get<CampaignManagementService>(CampaignManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
