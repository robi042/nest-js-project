import { CampaignConfigModel } from '../../models';
import {  CampaignConfigModel_REPOSITORY,  } from '../../config/constants';

export const emailProvider = [{
provide: CampaignConfigModel_REPOSITORY,
useValue: CampaignConfigModel
},
]