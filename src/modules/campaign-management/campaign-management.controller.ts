import { Controller, Post, Request, Body, UseGuards, Get, UseInterceptors, UploadedFile } from '@nestjs/common';
import {CampaignManagementService} from './campaign-management.service'
import { CampaignManagementQuotaService } from './campaign-management-quota.service'
import {CampaignManagementGroupService} from './campaign-management-group.service'
import { JwtAuthGuard } from '../../middleware/guards'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer';
import { CampaignConfigDto, CampaignQuotaDto, FacebookPagePostCRDDto } from '../../dto'
import { editFileName, imageFileFilter } from '../../utils/file-uploading.utils';
import {MinioClientService} from '../minio-client/minio-client.service'

@Controller('campaign-management')
@UseGuards(JwtAuthGuard)

export class CampaignManagementController {

    constructor(
        private campaignManagementService: CampaignManagementService,
        private campaignManagementQuotaService: CampaignManagementQuotaService,
        private campaignManagementGroupService: CampaignManagementGroupService,
        private minoClientService:MinioClientService
    ) { } 

    @Get('/get_campaign_channel_list')
    async GetCampaignChannels() {

        return this.campaignManagementService.GetCampaignChannels();

    }

    //campaign setting...
    @Get('/get_campaign_settings')
    async GetCampaignSettings(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.GetCampaignSettings(req.user);

    }

    //campaign setting...
    @Get('/get_merchent_campaign_settings')
    async GetMerchentCampaignSettings(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.GetMerchentCampaignSettings(req.user);

    }

    @Get('/get_fbpage_category')
    async GetFBPageCategoryList(@Request() req) {

        return this.campaignManagementService.GetFBPageCategoryList();

    }

    @Post('/update_facebook_page_crd')
    async UpdateFacebookPagePostSettings(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.UpdateFacebookPagePostSettings(reqbody, req.user);

    }

    @Post('/update_campaign_settings')
    async UpdateCampaignSettings(@Request() req, @Body() reqbody: CampaignConfigDto) {

        return this.campaignManagementService.UpdateCampaignSettings(reqbody, req.user,req);

    }

    @Post('/update_campaign_settings_not_fb')
    async UpdateCampaignSettingsWithoutFb(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.updateSettingWithoutFacebook(reqbody, req.user,req);

    }

    //for quota managment...start
    @Post('/create_campaign_quota')
    async createCampaignQuota(@Request() req, @Body() reqbody: CampaignQuotaDto) {

        return this.campaignManagementQuotaService.createCampaignQuota(reqbody, req.user);

    }

    @Get('/campaign_quota_list')
    async getAllCampaignQuotaList(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementQuotaService.getAllCampaignQuotaList(req.user);

    }

    @Post('/campaign_quota_approve_reject_delete')
    async CampaignQuotaAction(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementQuotaService.campaignQuotaAction(reqbody,req.user);

    }

   //for quota managment...end
    
    
   @Post('/get_interest_list')
   async getInterstList( @Body() reqbody: any) {

       return this.campaignManagementService.getInterestList(reqbody);

    }
    
    @Post('/get_lifeEvent_list')
    async getLifeEventList( @Body() reqbody: any) {
 
        return this.campaignManagementService.getLifeEventList(reqbody);
 
    }

    @Post('/get_country_list')
    async getCountryList( @Body() reqbody: any) {
 
        return this.campaignManagementService.getCountryList(reqbody);
 
    }

    @Post('/get_region_by_country_list')
    async getRegionByCountryList( @Body() reqbody: any) {
 
        return this.campaignManagementService.getRegionListByCountry(reqbody);
 
    }

    @Post('/get_behaviour_list')
    async getBehaviourList( @Body() reqbody: any) {
 
        return this.campaignManagementService.getBehaviourList(reqbody);
 
    }

    @Post('/get_userOs_list')
    async getUserOsList( @Body() reqbody: any) {
 
        return this.campaignManagementService.getUserOsList(reqbody);
 
    }

    @Post('/create_campaign_rule')
    async createCampaignRule(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.createCampaignRule(reqbody, req.user);

    }

    @Post('/edit_campaign_rule')
    async editCampaignRule(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.editCampaignRule(reqbody, req.user);

    }

    @Get('/campaign_rule_list')
    async getAllCampaignRuleList(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.getAllCampaignRuleList(req.user);

    }

    @Post('/single_campaign_rule')
    async singleCampaignRule(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.getOneRule(reqbody, req.user);

    }
    

    @Post('/campaign_rule_approve_reject_delete')
    async CampaignRuleAction(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.campaignRuleAction(reqbody,req.user);

    }

    @Post('/campaign_rule_delete')
    async CampaignRuleDelete(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.campaignRuleDelete(reqbody,req.user);

    }



    @Post('/campaign_ad_approve_reject_delete')
    async CampaignAdAction(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.campaignAdAction(reqbody,req.user);

    }

    @Post('/create_campaign_ad')
    async createCampaignAd(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.createCampaignAd(reqbody, req.user);

    }

    @Post('/edit_campaign_ad')
    async editCampaignad(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.editCampaignAd(reqbody, req.user);

    }

    @Get('/campaign_ad_list')
    async getAllCampaignAdList(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.getAllCampaignAdList(req.user);

    }


    @Post('/create_campaign_group')
    async createCampaignGroup(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementGroupService.createCampaignGroup(reqbody, req.user);

    }

    @Post('/edit_campaign_group')
    async editCampaignGroup(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementGroupService.editCampaignGroup(reqbody, req.user);

    }

    @Post('/contact_import_csv')
    async contactUploadCsv(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementGroupService.writeContactsToCsv(reqbody, req.user);

    }

    @Get('/campaign_group_list')
    async getAllCampaignGroupList(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementGroupService.getAllCampaignGroupList(req.user);

    }

    @Get('/campaign_group_pending_list')
    async getAllCampaignPendingGroupList(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementGroupService.getPendingGroupList(req.user);

    }

    @Post('/campaign_group_approve_reject_delete')
    async CampaignGroupAction(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementGroupService.campaignGroupAction(reqbody, req.user);

    }

    @Post('/getImageHash')
    @UseInterceptors(
      FileInterceptor('filename', {
        storage: diskStorage({
          destination: './files',
          filename: editFileName,
        }),
        fileFilter: imageFileFilter,
      }),
    )
    async uploadedFile(@UploadedFile() file, @Body() reqbody : any) {
      // const response = {
      //   originalname: file.originalname,
      //   filename: `./files/${file.filename}`,
      //   };
      console.log(__dirname);

      const filePath=`./files/${file.filename}`
      
      return await this.campaignManagementService.getImageHash(filePath,reqbody)
      //return filePath
        
      
    }


    @Post('/getlongLiveAccessToken')
    async getAccessToken(@Body() reqbody: any) {
      
      return await this. campaignManagementService.getLongLiveAccessToken(reqbody)
    }


    @Post('/create_campaign_budget')
    async createCampaignbudget(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementQuotaService.createCampaignBudget(reqbody, req.user);

    }


    @Get('/campaign_budget_list')
    async getAllCampaignBudgetList(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementQuotaService.getAllCampaignBudgetList(req.user);

    }

    @Get('/campaign_budget_pending_list')
    async getAllCampaignPendingbudgetList(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementQuotaService.getAllCampaignBudgePendingtList(req.user);

    }

    @Post('/campaign_budget_approve_reject_delete')
    async CampaignBudgetAction(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementQuotaService.campaignBudgetAction(reqbody, req.user);

    }

    @Post('/create_campaign_promotion')
    async createCampaignPromotion(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.createCampaignPromotion(reqbody, req.user);

    }

    @Get('/campaign_promotion_list')
    async getAllCampaignPromotionList(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.getAllCampaignPromotionList(req.user);

    }

    @Get('/campaign_promotion_pending_list')
    async getPendingCampaignPromotionList(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.pendingCampaignPromotionList(req.user);

    }

    @Post('/campaign_promotion_approve_reject_delete')
    async CampaignPromotionAction(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.campaignPromotionAction(reqbody, req.user);

    }

    @Post('/update_campaign_promotion')
    async updateCampaignPromotion(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.editCampaignPromotion(reqbody, req.user);

    }

    @Post('/create_google_facebook_campaign_rule')
    async CreateGoogleFacebookCampaignRule(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.createGoogleFacebookCampaignRule(reqbody,req.user);

    }

    @Post('/edit_google_facebook_campaign_rule')
    async UpdateGoogleFacebookCampaignRule(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.editGoogleFacebookCampaignRule(reqbody,req.user);

    }


    @Post('/google_facebook_campaign_rule_action')
    async GoogleFacebookCampaignRuleAction(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.googleFacebookCampaignRuleAction(reqbody,req.user);

    }


    @Get('/campaign_google_facebook_rule_list')
    async getAllGoogleFacebookCampaignRuleList(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.getAllGoogleFacebookCampaignRuleList(req.user);

    }

    //campaign_client_Creation

    @Post('/create_campaign_client')
    async campaignClientCreation(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.createClientForGoogle(reqbody,req.user);

    }

    @Get('/campaign_client_list')
    async campaignClientList(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.clientList();

    }

    @Get('/currency_list')
    async googleCurrencyList(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.googleCurrencyList();

    }

    @Get('/facebook_campaign_objectives')
    async facebookCampaignObjectives(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.FacebookCampaignObjectives();

    }

    @Get('/facebook_campaign_special_ad_categories')
    async facebookCampaignSpecialAdCategories(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.FacebookCampaignSpecialAdCategories();

    }

    @Get('/google_campaign_advertising_channel_type')
    async googleAdvertisingChannelType(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.GoogleCampaignAdvertisingChannelType();

    }

    @Get('/google_timezone_list')
    async googleTimezoneList(@Request() req, @Body() reqbody: any) {

        return this.campaignManagementService.GoogleTimezones();

    }


    

}
