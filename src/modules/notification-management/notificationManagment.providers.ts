
import { NotificationModel,CampaignCusGroupModel, CampaignCusGroupTempModel, CampaignCusGroupHistoryModel,CampaignCusGroupMapModel, CampaignCusGroupMapTempModel,
      CampaignBulkNotificationByGroupModel, CampaignBulkNotificationByGroupTempModel, CampaignBulkNotificationByGroupHistoryModel, CampaignBulkNotificationWithoutGroupModel,
      CampaignBulkNotificationWithoutGroupTempModel, CampaignBulkNotificationWithoutGroupHistoryModel, CampaignBulkNotificationChannelMapModel, CampaignConfigModel, GroupBaseModel, CampaignQuotaModel, CampaignGroupModel, CampaignNotificationFinalModel, BonusServiceCampaignModel } from '../../models';

import { Notification_Model, CAMPAIGN_CUS_GROUP_REPO, CAMPAIGN_CUS_GROUP_TEMP_REPO, CAMPAIGN_CUS_GROUP_HISTORY_REPO, CAMPAIGN_CUS_GROUP_MAP_REPO, CAMPAIGN_CUS_GROUP_MAP_TEMP_REPO,
  CAMPAIGN_BULK_NOTI_BY_GROUP_REPO,CAMPAIGN_BULK_NOTI_BY_GROUP_TEMP_REPO,CAMPAIGN_BULK_NOTI_BY_GROUP_HISTORY_REPO, CAMPAIGN_BULK_NOTI_WITHOUT_GROUP_REPO,
  CAMPAIGN_BULK_NOTI_WITHOUT_GROUP_TEMP_REPO, CAMPAIGN_BULK_NOTI_WITHOUT_GROUP_HISTORY_REPO, CAMPAIGN_BULK_NOTI_CHANNEL_MAP_REPO, CampaignConfigModel_REPOSITORY, GROUP_BASE, CAMPAIGN_QUOTA_REPOSITORY, CAMPAIGN_GROUP, NOTIFICATION_FINAL,BONUS_SERVICE_CAMPAIGN } from '../../config/constants';

export const NotificationManagmentProviders = [{
    provide: Notification_Model,
    useValue: NotificationModel
  },
  {
    provide: CAMPAIGN_CUS_GROUP_REPO,
    useValue: CampaignCusGroupModel
  },
  {
    provide: CAMPAIGN_CUS_GROUP_TEMP_REPO,
    useValue: CampaignCusGroupTempModel
  },
  {
    provide: CAMPAIGN_CUS_GROUP_HISTORY_REPO,
    useValue: CampaignCusGroupHistoryModel
  },
  {
    provide: CAMPAIGN_CUS_GROUP_MAP_REPO,
    useValue: CampaignCusGroupMapModel
  },
  {
    provide: CAMPAIGN_CUS_GROUP_MAP_TEMP_REPO,
    useValue: CampaignCusGroupMapTempModel
  },
  {
    provide: CAMPAIGN_BULK_NOTI_BY_GROUP_REPO,
    useValue: CampaignBulkNotificationByGroupModel
  },
  {
    provide: CAMPAIGN_BULK_NOTI_BY_GROUP_TEMP_REPO,
    useValue: CampaignBulkNotificationByGroupTempModel
  },
  {
    provide: CAMPAIGN_BULK_NOTI_BY_GROUP_HISTORY_REPO,
    useValue: CampaignBulkNotificationByGroupHistoryModel
  },
  {
    provide: CAMPAIGN_BULK_NOTI_WITHOUT_GROUP_REPO,
    useValue: CampaignBulkNotificationWithoutGroupModel
  },
  {
    provide: CAMPAIGN_BULK_NOTI_WITHOUT_GROUP_TEMP_REPO,
    useValue: CampaignBulkNotificationWithoutGroupTempModel
  },
  {
    provide: CAMPAIGN_BULK_NOTI_WITHOUT_GROUP_HISTORY_REPO,
    useValue: CampaignBulkNotificationWithoutGroupHistoryModel
  },
  {
    provide: CAMPAIGN_BULK_NOTI_CHANNEL_MAP_REPO,
    useValue: CampaignBulkNotificationChannelMapModel
  },
  {
    provide: CampaignConfigModel_REPOSITORY,
    useValue: CampaignConfigModel
  },
  
  {
    provide: GROUP_BASE,
    useValue: GroupBaseModel
    
  },
  {
    provide: CAMPAIGN_QUOTA_REPOSITORY,
    useValue: CampaignQuotaModel
  },
  {
    provide: CAMPAIGN_GROUP,
    useValue: CampaignGroupModel
  },
  {
    provide: NOTIFICATION_FINAL,
    useValue: CampaignNotificationFinalModel
  },
  {
    provide: BONUS_SERVICE_CAMPAIGN,
    useValue: BonusServiceCampaignModel
  }
];