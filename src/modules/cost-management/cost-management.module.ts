import { Module } from '@nestjs/common';
import { CostmanagementService } from './cost-management.service'
import { CostmanagementController } from './cost-management.controller';
import {CostmanagementProviders} from './cost-management.providers'

@Module({
  providers: [ CostmanagementService,  ...CostmanagementProviders],
  controllers: [CostmanagementController]
})
export class CostmanagementModule {}
