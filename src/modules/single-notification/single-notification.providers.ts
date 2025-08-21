import { CampaignConfigModel } from '../../models';
import {  CampaignConfigModel_REPOSITORY,  } from '../../config/constants';

export const singleNotificationProvider = [{
provide: CampaignConfigModel_REPOSITORY,
useValue: CampaignConfigModel
},
]