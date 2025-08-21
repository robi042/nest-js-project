import { Test, TestingModule } from '@nestjs/testing';
import { CostmanagementController } from './cost-management.controller';

describe('CostmanagementController', () => {
  let controller: CostmanagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CostmanagementController],
    }).compile();

    controller = module.get<CostmanagementController>(CostmanagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
