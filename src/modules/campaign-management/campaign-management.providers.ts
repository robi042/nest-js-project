
import {CampaignConfigModel, CampaignQuotaModel, CampaignQuotaHistoryModel, CampaignChannelsModel, CampaignRuleTempModel, CampaignRuleModel, CampaignRuleHistoryModel, CampaignAdModel, CampaignAdHistoryModel, CampaignGroupHistoryModel, CampaignGroupModel, GroupBaseTempModel, GroupBaseModel, CampaignGroupTempModel, CustomerWalletModel, CustomerWalletHistoryModel, CustomerWalletTempModel, CustomerProfileModel, GlobalCommissionModel, MerchantCommissionModel, GoogleCampaignRuleModel, FacebookCampaignRuleModel, GoogleCampaignRuleHistoryModel, FacebookCampaignRuleHistoryModel, CampaignPromotionModel, CampaignPromotionTempModel, CampaignPromotionHistoryModel, CampaignClientModel, GoogleCurrencyModel, FacebookCampaignObjectivesModel, FacebookSpecialAdCatagoriesModel, 
    GoogleCampaignAdvertisingChannelTypeModel, GoogleTimezoneModel, FacebookPageCategoryModel, FacebookPageSubCategoryModel,GoogleFacebookCampaignRuleHistoryModel,GoogleFacebookCampaignRuleModel} from '../../models'

import {CampaignConfigModel_REPOSITORY, CAMPAIGN_QUOTA_REPOSITORY, CAMPAIGN_QUOTA_HISTORY_REPOSITORY, CAMPAIGN_CHANNEL_REPO, CAMPAIGN_RULE_TEMP, CAMPAIGN_RULE, CAMPAIGN_RULE_HISTORY, CAMPAIGN_AD,CAMPAIGN_AD_HISTORY, CAMPAIGN_GROUP, CAMPAIGN_GROUP_HISTORY, GROUP_BASE_TEMP, GROUP_BASE, CAMPAIGN_GROUP_TEMP, CUSTOMER_WALLET, CUSTOMER_WALLET_HISTORY, CUSTOMER_WALLET_TEMP, CUSTOMER_PROFILE, GLOBAL_COMMISSION, MERCHANT_COMMISSION, GOOGLE_CAMPAIGN_RULE, FACEBOOK_CAMPAIGN_RULE, GOOGLE_CAMPAIGN_RULE_HISTORY, FACEBOOK_CAMPAIGN_RULE_HISTORY, CAMPAIGN_PROMOTION, CAMPAIGN_PROMOTION_TEMP, CAMPAIGN_PROMOTION_HISTORY, CAMPAIGN_CLIENT, GOOGLE_CURRENCY, FACEBOOK_CAMPAIGN_OBJECTIVES,FACEBOOK_SPECIALAD_CATAGORIES, GOOGLE_CAMPAIGN_ADVERTISING_CHANNEL_TYPE, GOOGLE_TIMEZONE, 
    FACEBOOKPAGESUBCATEGORY_REPO, FACEBOOKPAGECATEGORY_REPO, GOOGLE_FACEBOOK_CAMPAIGN, GOOGLE_FACEBOOK_CAMPAIGN_HISTORY} from '../../config/constants'

export const CampaignManagmentProviders = [
    {
        provide: FACEBOOKPAGECATEGORY_REPO,
        useValue: FacebookPageCategoryModel
    },
    {
        provide: FACEBOOKPAGESUBCATEGORY_REPO,
        useValue: FacebookPageSubCategoryModel
    },
    {
        provide: CampaignConfigModel_REPOSITORY,
        useValue: CampaignConfigModel
    },
    {
        provide: CAMPAIGN_QUOTA_REPOSITORY,
        useValue: CampaignQuotaModel
    },
    {
        provide: CAMPAIGN_QUOTA_HISTORY_REPOSITORY,
        useValue: CampaignQuotaHistoryModel
    },
    {
        provide: CAMPAIGN_CHANNEL_REPO,
        useValue: CampaignChannelsModel
    },
    {
        provide: CAMPAIGN_RULE_TEMP,
        useValue: CampaignRuleTempModel
    },
    {
        provide: CAMPAIGN_RULE,
        useValue: CampaignRuleModel
    },
    {
        provide: CAMPAIGN_RULE_HISTORY,
        useValue: CampaignRuleHistoryModel
    },
    {
        provide: CAMPAIGN_AD,
        useValue: CampaignAdModel
    },
    {
        provide: CAMPAIGN_AD_HISTORY,
        useValue: CampaignAdHistoryModel
    },
    {
        provide: CAMPAIGN_GROUP,
        useValue: CampaignGroupModel
    },
    {
        provide: CAMPAIGN_GROUP_TEMP,
        useValue: CampaignGroupTempModel
    },
    {
        provide: CAMPAIGN_GROUP_HISTORY,
        useValue: CampaignGroupHistoryModel
    },
    {
        provide: GROUP_BASE_TEMP,
        useValue: GroupBaseTempModel
    },
    {
        provide: GROUP_BASE,
        useValue: GroupBaseModel
    },
    {
        provide: CUSTOMER_WALLET,
        useValue: CustomerWalletModel
    },
    {
        provide: CUSTOMER_WALLET_TEMP,
        useValue: CustomerWalletTempModel
    },
    {
        provide: CUSTOMER_WALLET_HISTORY,
        useValue: CustomerWalletHistoryModel
    },
    {
        provide: CUSTOMER_PROFILE,
        useValue: CustomerProfileModel
    },
    {
        provide: GLOBAL_COMMISSION,
        useValue: GlobalCommissionModel
    },
    {
        provide: MERCHANT_COMMISSION,
        useValue: MerchantCommissionModel   
    },
    {
        provide: GOOGLE_CAMPAIGN_RULE,
        useValue: GoogleCampaignRuleModel   
    },
    {
        provide: FACEBOOK_CAMPAIGN_RULE,
        useValue: FacebookCampaignRuleModel   
    },
    {
        provide: GOOGLE_CAMPAIGN_RULE_HISTORY,
        useValue: GoogleCampaignRuleHistoryModel   
    },
    {
        provide: FACEBOOK_CAMPAIGN_RULE_HISTORY,
        useValue: FacebookCampaignRuleHistoryModel   
    },
    {
        provide: CAMPAIGN_PROMOTION,
        useValue: CampaignPromotionModel   
    },
    {
        provide: CAMPAIGN_PROMOTION_HISTORY,
        useValue: CampaignPromotionHistoryModel   
    },
    {
        provide: CAMPAIGN_PROMOTION_TEMP,
        useValue: CampaignPromotionTempModel   
    },
    {
        provide: CAMPAIGN_CLIENT,
        useValue: CampaignClientModel   
    },
    {
        provide: GOOGLE_CURRENCY,
        useValue: GoogleCurrencyModel   
    },
    {
        provide: FACEBOOK_CAMPAIGN_OBJECTIVES,
        useValue: FacebookCampaignObjectivesModel   
    },
    {
        provide: FACEBOOK_SPECIALAD_CATAGORIES,
        useValue: FacebookSpecialAdCatagoriesModel   
    },
    {
        provide: GOOGLE_CAMPAIGN_ADVERTISING_CHANNEL_TYPE,
        useValue: GoogleCampaignAdvertisingChannelTypeModel   
    },
    {
        provide: GOOGLE_TIMEZONE,
        useValue: GoogleTimezoneModel   
    },
    {
        provide: GOOGLE_FACEBOOK_CAMPAIGN,
        useValue: GoogleFacebookCampaignRuleModel   
    },
    {
        provide: GOOGLE_FACEBOOK_CAMPAIGN_HISTORY,
        useValue: GoogleFacebookCampaignRuleHistoryModel   
    }
];