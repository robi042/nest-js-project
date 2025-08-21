import { Module } from '@nestjs/common';
import { CampaignManagementService } from './campaign-management.service';
import { CampaignManagementQuotaService } from './campaign-management-quota.service'
import {CampaignManagementGroupService} from './campaign-management-group.service'
import { CampaignManagementController } from './campaign-management.controller';
import { CampaignManagmentProviders } from './campaign-management.providers'
import { MinioClientModule } from '../minio-client/minio-client.module'

@Module({
  imports : [MinioClientModule],
  providers: [ CampaignManagementService,CampaignManagementQuotaService,CampaignManagementGroupService,  ...CampaignManagmentProviders],
  controllers: [CampaignManagementController]
})
export class CampaignManagementModule {}
