import { Injectable, Inject, BadRequestException, UnprocessableEntityException,NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import {CampaignConfigModel, CampaignChannelsModel, CampaignRuleTempModel, CampaignRuleModel, CampaignRuleHistoryModel, CampaignAdModel, CampaignAdHistoryModel, CampaignQuotaModel, GoogleCampaignRuleModel, FacebookCampaignRuleModel, GoogleCampaignRuleHistoryModel, FacebookCampaignRuleHistoryModel, CampaignPromotionModel, CampaignPromotionHistoryModel, CampaignPromotionTempModel,CampaignClientModel, GoogleCurrencyModel, FacebookCampaignObjectivesModel, FacebookSpecialAdCatagoriesModel, 
    GoogleCampaignAdvertisingChannelTypeModel, GoogleTimezoneModel, FacebookPageCategoryModel, FacebookPageSubCategoryModel, GoogleFacebookCampaignRuleHistoryModel, GoogleFacebookCampaignRuleModel} from '../../models'

import {CampaignConfigModel_REPOSITORY, CAMPAIGN_CHANNEL_REPO, CAMPAIGN_RULE_TEMP, CAMPAIGN_RULE, CAMPAIGN_RULE_HISTORY, CAMPAIGN_AD, CAMPAIGN_AD_HISTORY, CAMPAIGN_QUOTA_REPOSITORY, GOOGLE_CAMPAIGN_RULE, FACEBOOK_CAMPAIGN_RULE, GOOGLE_CAMPAIGN_RULE_HISTORY, FACEBOOK_CAMPAIGN_RULE_HISTORY, CAMPAIGN_PROMOTION, CAMPAIGN_PROMOTION_TEMP, CAMPAIGN_PROMOTION_HISTORY, CAMPAIGN_CLIENT, GOOGLE_CURRENCY, FACEBOOK_CAMPAIGN_OBJECTIVES, FACEBOOK_SPECIALAD_CATAGORIES, GOOGLE_CAMPAIGN_ADVERTISING_CHANNEL_TYPE, 
    GOOGLE_TIMEZONE,FACEBOOKPAGESUBCATEGORY_REPO, FACEBOOKPAGECATEGORY_REPO, GOOGLE_FACEBOOK_CAMPAIGN, GOOGLE_FACEBOOK_CAMPAIGN_HISTORY} from '../../config/constants'
import axios from 'axios'
import  FormData from 'form-data';
import {SecondDiffBetweenToDates} from '../../helpers/utils'
import { winstonLog } from '../../config/winstonLog'
import { Sequelize} from 'sequelize-typescript';
import { Op } from 'sequelize';
import fs, { createReadStream, createWriteStream} from 'fs';

const FACEBOOK_API_BASE_URL = 'https://graph.facebook.com/v12.0'

@Injectable()
export class CampaignManagementService {

    constructor(
        @Inject(CampaignConfigModel_REPOSITORY) private readonly campaignConfig: typeof CampaignConfigModel,
        @Inject(CAMPAIGN_CHANNEL_REPO) private readonly campaignChannels: typeof CampaignChannelsModel,
        @Inject(CAMPAIGN_RULE_TEMP) private readonly campaignRuleTemp: typeof CampaignRuleTempModel,
        @Inject(CAMPAIGN_RULE) private readonly campaignRule: typeof CampaignRuleModel,
        @Inject(CAMPAIGN_RULE_HISTORY) private readonly campaignRuleHistory: typeof CampaignRuleHistoryModel,
        @Inject(CAMPAIGN_AD) private readonly campaignAd: typeof CampaignAdModel,
        @Inject(CAMPAIGN_AD_HISTORY) private readonly campaignAdHistory: typeof CampaignAdHistoryModel,
        @Inject(CAMPAIGN_QUOTA_REPOSITORY) private readonly campaignQuota: typeof CampaignQuotaModel,
        @Inject(GOOGLE_CAMPAIGN_RULE) private readonly googleCampaignRule: typeof GoogleCampaignRuleModel,
        @Inject(GOOGLE_CAMPAIGN_RULE_HISTORY) private readonly googleCampaignRuleHistory: typeof GoogleCampaignRuleHistoryModel,
        @Inject(FACEBOOK_CAMPAIGN_RULE) private readonly facebookCampaignRule: typeof FacebookCampaignRuleModel,
        @Inject(FACEBOOK_CAMPAIGN_RULE_HISTORY) private readonly facebookCampaignRuleHistory: typeof FacebookCampaignRuleHistoryModel,
        @Inject(CAMPAIGN_PROMOTION) private readonly campaignPromotion: typeof CampaignPromotionModel,
        @Inject(CAMPAIGN_PROMOTION_TEMP) private readonly campaignPromotionTemp: typeof CampaignPromotionTempModel,
        @Inject(CAMPAIGN_PROMOTION_HISTORY) private readonly campaignPromotionHistory: typeof CampaignPromotionHistoryModel,
        @Inject(CAMPAIGN_CLIENT) private readonly campaignClient: typeof CampaignClientModel,
        @Inject(GOOGLE_CURRENCY) private readonly googleCurrency: typeof GoogleCurrencyModel, 
        @Inject(GOOGLE_CAMPAIGN_ADVERTISING_CHANNEL_TYPE) private readonly googleCampaignAdvertisingChannelType: typeof GoogleCampaignAdvertisingChannelTypeModel,
        @Inject(FACEBOOK_CAMPAIGN_OBJECTIVES) private readonly facebookCampaignObjectives: typeof FacebookCampaignObjectivesModel,
        @Inject(FACEBOOK_SPECIALAD_CATAGORIES) private readonly facebookSpecialAdCategories: typeof FacebookSpecialAdCatagoriesModel,
        @Inject(GOOGLE_TIMEZONE) private readonly googleTimezones: typeof GoogleTimezoneModel,

        @Inject(FACEBOOKPAGECATEGORY_REPO) private readonly facebookPageCategoryRepo: typeof FacebookPageCategoryModel, 
        @Inject(FACEBOOKPAGESUBCATEGORY_REPO) private readonly facebookPageSubCategoryRepo: typeof FacebookPageSubCategoryModel, 

        @Inject(GOOGLE_FACEBOOK_CAMPAIGN) private readonly googleFacebookCampaignRepo: typeof GoogleFacebookCampaignRuleModel, 
        @Inject(GOOGLE_FACEBOOK_CAMPAIGN_HISTORY) private readonly googleFacebookCampaignHistoryRepo: typeof GoogleFacebookCampaignRuleHistoryModel, 
      
    ) { }

    FacebookErrorMessage(errorCode, errorMsg) {
        let errors = {}
        switch (errorCode) {

            case 2:
                errors = {
                    app_id: ["Invalid app id"]
                }
                break
            case 1:
                errors = {
                    app_secret: ["Invalid app secret"]
                }
                break
            case 190:
                errors = {
                    user_token: [errorMsg]
                }
                break
        }

        return errors
    }
    async GetFBPageCategoryList() {

      return await this.facebookPageCategoryRepo.findAll({ include:[{ model: FacebookPageSubCategoryModel, as: 'subcategory'}]})
    }
    async GetCampaignChannels() {

        return await this.campaignChannels.findAll({ where: { is_active: true } })
    }

    async GetBehaviourList() {

        return await this.campaignChannels.findAll({ where: { is_active: true } })
    }

    async FacebookCampaignObjectives() {

        return await this.facebookCampaignObjectives.findAll({})
    }

    async GoogleTimezones() {

        return await this.googleTimezones.findAll({attributes:['Timezone']})
    }

    async FacebookCampaignSpecialAdCategories() {

        return await this.facebookSpecialAdCategories.findAll({})
    }

    async GoogleCampaignAdvertisingChannelType() {

        return await this.googleCampaignAdvertisingChannelType.findAll({})
    }

    async GetCampaignSettings(userinfo) {

        let response = null
        const { id, username = null, roleid = 0 } = userinfo

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`

        return await this.campaignConfig.findOne<CampaignConfigModel>({ where: { created_by, created_user_type } })

    }

    async GetMerchentCampaignSettings(userinfo) {

        let response = null
        const { id, username = null, roleid = 0 } = userinfo

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`

        const data = await this.campaignConfig.findOne<CampaignConfigModel>({ where: { created_by, created_user_type } })
        const getAdminConfig = await this.campaignConfig.findOne<CampaignConfigModel>({ where: { created_user_type: 1, created_by: '13' } })

        if(data) {
            response = {...data['dataValues']}
        }
        if(getAdminConfig) {
            response = {...response, global_facebook_page_id: getAdminConfig['dataValues']['facebook_pagepost_page_id'] }
        }

        return response

    }

    async getFacebookPageAccessToken(pageId,access_token) {

        const pageIdresponse = await axios.get(`${FACEBOOK_API_BASE_URL}/${pageId}?fields=access_token&access_token=${access_token}`)
                                     .catch(e => e.response)

            if (pageIdresponse['data']['error']) {

                //pageId => is not valid..
                winstonLog.log('error', ' Facebook pageId Response :  %s', pageIdresponse['data']['error']['message'], { label: 'Facebook' })
                throw new BadRequestException(pageIdresponse['data']['error']['message'])

            }

        winstonLog.log('info', ' Facebook pageId Response :  %s', pageIdresponse['data'], { label: 'Facebook' })    

        return {page_access_token: pageIdresponse['data']['access_token'], page_name : pageIdresponse['data']['name']}
    }

    async getLongLiveAccessTokenV2(user_token): Promise<any> {
        
        const responseFromDb = await this.campaignConfig.findOne({ attributes: ['app_id', 'app_secret'], where:{created_user_type:1}, order:[['id','ASC']] })
        
        if(!responseFromDb){
            return null
        }
        
        const url = `https://graph.facebook.com/v13.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${responseFromDb.app_id}&client_secret=${responseFromDb.app_secret}&fb_exchange_token=${user_token}`
        
        const response = await axios.get(url)
                        .catch(e => {

                            winstonLog.log('error', `${url} api Response %o`,e.response )
                            return e.response
                        })

            if (response['data']['error']) {

                //pageId => is not valid..
                winstonLog.log('error', ' Facebook LongLiveAccessToken Response :  %s', response['data']['error']['message'], { label: 'Facebook' })
                throw new BadRequestException(response['data']['error']['message'])
    
            }

        return response.data.access_token
    }

    async getLongLiveAccessTokenV3(user_token, facebook_pagepost_page_id, app_secret): Promise<any> {
        
        const url = `https://graph.facebook.com/v13.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${facebook_pagepost_page_id}&client_secret=${app_secret}&fb_exchange_token=${user_token}`
        
        const response = await axios.get(url)
                        .catch(e => {

                            winstonLog.log('error', `${url} api Response %o`,e.response )
                            return e.response
                        })

        if (response['data']['error']) {

            //pageId => is not valid..
            winstonLog.log('error', ' Facebook LongLiveAccessToken Response :  %s', response['data']['error']['message'], { label: 'Facebook' })
            throw new BadRequestException(response['data']['error']['message'])

        }

        winstonLog.log('info', ' Facebook LongLiveAccessToken Response :  %s', response['data'], { label: 'Facebook' }) 
        
        return response.data.access_token
    }

    async UpdateFacebookPagePostSettings(reqbody, userinfo) {

        let { facebook_pagepost_page_id = null, app_secret = null, facebook_user_id=null, user_access_token=null, pageId=null, 
            allow_admin_facebook_page_post=false , allow_other_merchant_facebook_page_post=false, facebook_page_category_localuid=null, facebookpage_subcategory_localuid=null } = reqbody
        
        let { id, username = null, roleid = 0 } = userinfo, page_access_token = null, page_name = null
        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = id

        if(user_access_token && created_user_type == 1){
            user_access_token = await this.getLongLiveAccessTokenV3(user_access_token, facebook_pagepost_page_id, app_secret)
        }
        else if(user_access_token){
            user_access_token = await this.getLongLiveAccessTokenV2(user_access_token)
        }
        else{
            winstonLog.log('error',' user_access_token is null', { label: 'Facebook' })
        }

        if(user_access_token && pageId){

           const page_data = await this.getFacebookPageAccessToken(pageId,user_access_token)
           page_access_token = page_data.page_access_token
           page_name = page_data.page_name
        }

        const settings_info = await this.GetCampaignSettings(userinfo)

        if (settings_info) {

            this.campaignConfig.update({ 
                facebook_pagepost_page_id,
                app_id: facebook_pagepost_page_id,
                app_secret: app_secret || settings_info.app_secret,
                facebook_user_id,
                user_access_token,
                page_access_token: page_access_token || settings_info.page_access_token,
                page_id: pageId,
                allow_admin_facebook_page_post,
                allow_other_merchant_facebook_page_post,
                facebook_page_category_localuid: facebook_page_category_localuid || settings_info.facebook_page_category_localuid,
                facebookpage_subcategory_localuid : facebookpage_subcategory_localuid ,
                page_name
            }, { where: { id: settings_info['dataValues']['id'] } })
        }
        else {

            this.campaignConfig.create({ 
                keyword: "Facebook", 
                facebook_pagepost_page_id, 
                app_id: facebook_pagepost_page_id,
                app_secret,
                facebook_user_id,
                user_access_token,
                page_access_token,
                page_id: pageId,
                allow_admin_facebook_page_post,
                allow_other_merchant_facebook_page_post,
                created_by, 
                created_user_type,
                page_name 
            })
        }

        return true

    }

    async UpdateCampaignSettings(reqbody, userinfo, req) {

        const { app_id, app_secret, instagram_actor_id = null,user_token, pageId, adAccountId, allow_admin_facebook_page_post , allow_other_merchant_facebook_page_post } = reqbody.facebook, user_id = null
   
        let { id, username = null, roleid = 0 } = userinfo, remainningTime = 0, response = {}, setnewexpireTime = false, user_access_token_expire_at = null, page_access_token = null, errors = {}

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = id

        const settings_info = await this.GetCampaignSettings(userinfo)

        if (settings_info && settings_info['dataValues']['user_access_token_expire_at']) {

            remainningTime = SecondDiffBetweenToDates(settings_info['dataValues']['user_access_token_expire_at'])
            response = { data: { access_token: settings_info['dataValues']['user_access_token'] } }
            user_access_token_expire_at = settings_info['dataValues']['user_access_token_expire_at']
        }

        //if 10 hour remainning..
        if (!settings_info || remainningTime < 36000 || settings_info['dataValues']['user_token'] != user_token) {

            //check app_id, app_secret, user_token valid or not
            response = await axios.get(`${FACEBOOK_API_BASE_URL}/oauth/access_token?grant_type=fb_exchange_token&client_id=${app_id}&client_secret=${app_secret}&fb_exchange_token=${user_token}`).catch(e => e.response)

            if (response['data']['error']) {
    
                //app_id, app_secret, user_token, => any one is not valid..
                const error = this.FacebookErrorMessage(response['data']['error']['code'], response['data']['error']['message'])
                errors = { ...errors, ...error }
                winstonLog.log('error', ' Facebook access_token Response :  %s', response['data']['error']['message'], { label: 'Facebook' })

                throw new UnprocessableEntityException(errors)
              
            }

            setnewexpireTime = true
        }

        //no need....
        /*if (!settings_info || pageId != settings_info['dataValues']['page_id']) {
            //check pageId valid or not
            const pageIdresponse = await axios.get(`${FACEBOOK_API_BASE_URL}/${pageId}?fields=access_token&access_token=${response['data']['access_token']}`).catch(e => e.response)

            if (pageIdresponse['data']['error']) {

                //pageId => is not valid..
                errors = { ...errors, pageId: ["Invalid page id"] }
                winstonLog.log('error', ' Facebook pageId Response :  %s', pageIdresponse['data']['error']['message'], { label: 'Facebook' })

            }

            page_access_token = pageIdresponse['data']['access_token']
        }*/

        if (!settings_info || adAccountId != settings_info['dataValues']['ad_account_id']) {
            //check adAccountId valid or not... not work for send box id
            /*  const adAccountIdresponse = await axios.get(`${FACEBOOK_API_BASE_URL}/act_${adAccountId}?access_token=${response['data']['access_token']}`).catch(e => e.response)
  
              if(adAccountIdresponse['data']['error']) {
  
                  //adAccountId => is not valid..
                  errors = {...errors,adAccountId : ["Invalid ad account id"] }
                  winstonLog.log('error',' Facebook adAccountId Response :  %s', adAccountIdresponse['data']['error']['message'], { label: 'Facebook' })
  
              }*/
        }

        if (Object.keys(errors).length != 0) {

            throw new UnprocessableEntityException(errors)
        }

        if (setnewexpireTime) {

            const expireDateTime = new Date(Date.now())
            console.log(`parseInt(response['data']['expires_in']) `, response['data']['expires_in'])
            expireDateTime.setSeconds(expireDateTime.getSeconds() + parseInt(response['data']['expires_in'] || 4320000))

            console.log('expireDateTime ', expireDateTime)
            user_access_token_expire_at = `${expireDateTime}`
            console.log('user_access_token_expire_at ', user_access_token_expire_at)

        }

        if (settings_info) {

            this.campaignConfig.update({
                user_access_token: response['data']['access_token'],
                user_access_token_expire_at: user_access_token_expire_at,
                // page_id: pageId,
                page_access_token,
                facebook_user_id: user_id,
                app_id,
                app_secret,
                user_token,
                ad_account_id: adAccountId,
                allow_admin_facebook_page_post: allow_admin_facebook_page_post,
                allow_other_merchant_facebook_page_post: allow_other_merchant_facebook_page_post,
                instagram_actor_id,
                facebook_pagepost_page_id: app_id
            }, { where: { id: settings_info['dataValues']['id'] } })
        }
        else {

            this.campaignConfig.create({
                keyword: "Facebook",
                user_access_token: response['data']['access_token'],
                user_access_token_expire_at: user_access_token_expire_at,
                // page_id: pageId,
                page_access_token,
                facebook_user_id: user_id,
                app_id,
                app_secret,
                user_token,
                ad_account_id: adAccountId,
                created_by,
                created_user_type,
                facebook_pagepost_page_id: app_id,
                allow_admin_facebook_page_post: allow_admin_facebook_page_post,
                allow_other_merchant_facebook_page_post: allow_other_merchant_facebook_page_post,
                instagram_actor_id
            })
        }

        return true

    }


    async updateSettingWithoutFacebook(reqbody, userinfo, req) {
        const { google_refresh_token, google_client_secret, google_client_id, google_developer_token } = reqbody.google
        const { email_address, email_password, email_port, email_config_type, email_service, email_host } = reqbody.email
        const { fcm_server_ring } = reqbody.push_notification
        const { id, username = null, roleid = 0 } = userinfo
        const settings_info = await this.GetCampaignSettings(userinfo)
        const created_by = id
        if (settings_info) {

            this.campaignConfig.update({
                google_refresh_token,
                google_client_secret,
                google_client_id,
                google_developer_token,
                email_address,
                email_password,
                fcm_server_ring,
                email_port,
                email_config_type,
                email_service,
                email_host

            }, { where: { id: settings_info['dataValues']['id'] } })
        }
        else {
 
            this.campaignConfig.create({
                keyword: "Facebook",
                created_by,
                google_refresh_token,
                google_client_secret,
                google_client_id,
                google_developer_token,
                email_address,
                email_password,
                fcm_server_ring,
                email_port,
                email_config_type,
                email_service,
                email_host
            })
        }

        
    }

    async createClientForGoogle(reqbody, userinfo) {
        const { name, currency_code, time_zone } = reqbody
        const { id, username = null, roleid = 0 } = userinfo
        const settings_info = await this.GetCampaignSettings(userinfo)
        const created_by = id
       
        return this.campaignClient.create({
            created_by,
            name,
            currency_code,
            time_zone,
        })
  

        
    }

    async clientList() {
        
        return await this.campaignClient.findAll({})
    }

    async googleCurrencyList() {
        
        return await this.googleCurrency.findAll({attributes:['CurrencyCode', 'CurrencyName']})
    }

    async getInterestList(requestbody: any): Promise<any> {
        const {  adAccountId, interest } = requestbody

        const campaignConfig = await this.campaignConfig.findOne({where:{created_user_type:1}})
        
        const access_token=campaignConfig.user_access_token
        
        const response = await axios.get(`https://graph.facebook.com/v16.0/search?access_token=${access_token}&type=adTargetingCategory&class=interests`)
        
        return response.data
    }

    async getLifeEventList(requestbody: any): Promise<any> {
        const {  adAccountId, interest } = requestbody

        const campaignConfig = await this.campaignConfig.findOne({where:{created_user_type:1}})
        
        const access_token=campaignConfig.user_access_token
        
        const response = await axios.get(`https://graph.facebook.com/v16.0/search?access_token=${access_token}&type=adTargetingCategory&class=life_events`)
        
        return response.data
    }


    async getCountryList(requestbody: any): Promise<any> {
        const {  adAccountId, interest } = requestbody

        const campaignConfig = await this.campaignConfig.findOne({where:{created_user_type:1}})
        
        const access_token = campaignConfig.user_access_token
        console.log('access_token', access_token)
        
        const response = await axios.get(`https://graph.facebook.com/v16.0/search?access_token=${access_token}&type=adgeolocation&location_types=["country"]&limit=1000`)
        
        return response.data
    }

    async getRegionListByCountry(requestbody: any): Promise<any> {
        const {  adAccountId, countryCode } = requestbody

        const campaignConfig = await this.campaignConfig.findOne({where:{created_user_type:1}})
        
        const access_token=campaignConfig.user_access_token
        
        const response = await axios.get(`https://graph.facebook.com/v16.0/search?access_token=${access_token}&type=adgeolocation&location_types=["region"]&limit=1000&q=${countryCode}`)
        
        return response.data
    }

    async getImageHash(imagePath: any,requestbody: any): Promise<any> { 

        const access_token = await this.campaignConfig.findOne({  attributes: ['user_access_token','ad_account_id'], where:{created_user_type: 1} })
          //const adAccountId = await this.campaignconfig.findOne({  attributes: ['ad_account_id'] })
        
         //const {adAccountId }=requestbody
        
        const formData = new FormData();
        const readStream = createReadStream(imagePath);
 
         
        formData.append("filename", readStream);
        formData.append("access_token", access_token.user_access_token);
        formData.append("adAccountId",access_token.ad_account_id);
         
        console.log(formData.getHeaders())
 
        const response = await axios.post(`https://graph.facebook.com/v16.0/act_${access_token.ad_account_id}/adimages`, formData, { headers: formData.getHeaders() })

        // console.log(response.data);
        

        return response.data
        // return 1

    }

    async getLongLiveAccessToken(requestbody: any): Promise<any> {
        
        const { user_token } = requestbody

        const responseFromDb = await this.campaignConfig.findOne({ attributes: ['app_id', 'app_secret'], where:{created_user_type:1}, order:[['id','ASC']] })
        
        const response = await axios.get(`https://graph.facebook.com/v13.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${responseFromDb.app_id}&client_secret=${responseFromDb.app_secret}&fb_exchange_token=${user_token}`)

        if (responseFromDb) {
            this.campaignConfig.update({ user_access_token: response.data.access_token }, { where: { id: responseFromDb.id } })
        }

        return response.data
    }

    async getBehaviourList(requestbody: any): Promise<any> {
        const {  adAccountId, countryCode } = requestbody

        const campaignConfig = await this.campaignConfig.findOne({where:{created_user_type:1}})
        
        const access_token=campaignConfig.user_access_token
        
        const response = await axios.get(`https://graph.facebook.com/v16.0/search?access_token=${access_token}&type=adTargetingCategory&class=behaviors`)
        
        return response.data
    }

    async getUserOsList(requestbody: any): Promise<any> {
        const {  adAccountId, countryCode } = requestbody

        const campaignConfig = await this.campaignConfig.findOne({where:{created_user_type:1}})
        
        const access_token=campaignConfig.user_access_token
        
        const response = await axios.get(`https://graph.facebook.com/v16.0/search?access_token=${access_token}&type=adTargetingCategory&class=user_os`)
        
        return response.data
    }

//campaign rule
    
    async createCampaignRule(reqbody, userinfo) {

        const {id, username = null, roleid = 0, mobile=null, idx = 0} = userinfo

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`, created_by_name = username ? username : mobile

        const {rule_name, gender, max_age, min_age, country, region, isCustomizeGroup , rule_type, group , start_date, expired_date, behavior,interest,interest_id,life_event,relationship_status,device_platform,user_os, campaign_objective, keyword, income, longtitude, latitude, radius_unit, country_code, province_name, province_code, postal_code, city_name, street_address, radius, campaginId_Faecbook, campaignId_Google,daily_budget,group_name,ad_campaign} = reqbody

        const createBody = {
            rule_name,
            gender,
            max_age,
            min_age,
            country,
            region,
            behavior,
            interest,
            interest_id,
            life_event,
            daily_budget,
            relationship_status,
            device_platform,
            user_os,
            campaign_objective,
            keyword,
            isCustomizeGroup,
            group,
            rule_type,
            start_date,
            expired_date,
            income,
            longtitude,
            latitude,
            radius_unit,
            country_code,
            province_name,
            province_code,
            postal_code,
            city_name,
            street_address,
            radius,
            created_by,
            created_by_name,
            created_user_type,
            action : "INSERT",
            action_by : created_by,
            action_by_name : created_by_name,
            action_by_user_type: created_user_type,
            idx,
            campaginId_Faecbook,
            campaignId_Google,
            group_name,
            ad_campaign

}

        this.campaignRuleHistory.create(createBody)

        return await this.campaignRule.create(createBody)
    }

    async editCampaignRule(reqbody, userinfo) {

        const {id, username = null, roleid = 0, mobile=null, idx = 0} = userinfo

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`, created_by_name = username ? username : mobile

        const {rule_name, gender, max_age, min_age, country, region, isCustomizeGroup , group , rule_type, start_date, expired_date, behavior,interest,interest_id,life_event,campaign_objective,relationship_status,device_platform,user_os, keyword, income, longtitude, latitude, radius_unit, country_code, province_name, province_code, postal_code, city_name, street_address, radius , daily_budget,  campaginId_Faecbook, campaignId_Google, group_name,
            ad_campaign, id:ad_id} = reqbody

        const rule=await this.campaignRule.findOne({where: {
            [Op.and]: [
              { id: ad_id },
              { is_approved: true },
            ],
        }
        })

        const createBody = {
            rule_name,
            gender,
            max_age,
            min_age,
            country,
            region,
            behavior,
            interest,
            interest_id,
            isCustomizeGroup,
            group,
            rule_type,
            start_date,
            expired_date,
            daily_budget,
            life_event,
            relationship_status,
            device_platform,
            user_os,
            keyword,
            income,
            longtitude,
            latitude,
            radius_unit,
            country_code,
            province_name,
            province_code,
            postal_code,
            campaign_objective,
            city_name,
            street_address,
            radius,
            created_by,
            created_by_name,
            created_user_type,
            action : "UPDATE",
            action_by : created_by,
            action_by_name : created_by_name,
            action_by_user_type: created_user_type,
            idx,
            campaginId_Faecbook,
            campaignId_Google,
            group_name,
            ad_campaign,
            is_approved: false,
            is_rejected: false,
            approved_by: null,
            approved_at: null
        }
        
        if (rule) {
            
            this.campaignRule.update( createBody , { where: { id: ad_id } })
            
            return this.campaignRuleHistory.create(createBody)
            
        } else {
            return 'No Rule found'
        }

        

        //return await this.campaignRule.create(createBody)
    }



    async getAllCampaignRuleList(userinfo) {

        let {id, username = null, roleid = 0, idx = 0} = userinfo

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`

        idx = (created_user_type == 2 && idx) ? idx  : (created_user_type == 1) ? 0 : -1

        if(created_user_type == 1) {

            return this.campaignRule.findAll<CampaignRuleModel>({ order : [['id','DESC']] })

        }
        else {

            return this.campaignRule.findAll<CampaignRuleModel>({ where : { created_by, created_user_type, idx}, order :[['id','DESC']]})

        }
    }

    async getOneRule(reqbody,userinfo) {
        let { id, username = null, roleid = 0, idx = 0 } = userinfo
        
        let {rule_id}=reqbody

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`

        idx = (created_user_type == 2 && idx) ? idx  : (created_user_type == 1) ? 0 : -1

        let singleRule = this.campaignRule.findOne({ where: { id: rule_id } })
        
        if (singleRule == null) {

            throw new BadRequestException('No rule for this id')

        }
        else {
            return singleRule
        }

            

        
    }

    async campaignRuleAction(reqbody,userinfo){
        
        let {id, username = null, roleid = 0} = userinfo, action = 'REJECTED'

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`

        //action_id = 1=> approve, action_id = 2=> reject, action_id = 3 => delete
        const {action_id = 2, rule_id, reject_msg = null} = reqbody

        action = (action_id == 1) ? 'APPROVED' : (action_id == 2) ? 'REJECTED' : 'DELETE'

        const adinfo = await this.campaignRule.findOne({ where : { id : rule_id} })

        if(!adinfo) {

            throw new NotFoundException()
        }

        if(adinfo['dataValues']['created_by'] == created_by && (action_id == 1 || action_id == 2)) {

            throw new BadRequestException('You cannot Approve/Reject it')
        }

        const {rule_name, max_age, min_age, region, behavior, interest, interest_id, isCustomizeGroup , group ,rule_type, start_date, expired_date, campaign_objective, life_event, device_platform, user_os, gender, relationship_status, country, keyword, income, longtitude, latitude, radius_unit, country_code, province_name, province_code, daily_budget, postal_code, city_name, street_address, radius , campaginId_Faecbook,campaignId_Google, group_name,
            ad_campaign, created_by_name, created_by : old_created_by = null, created_by_name: old_created_by_name = null, created_user_type : old_created_user_type = null, idx } = adinfo['dataValues']
        const createBody = {
            rule_name,
            max_age,
            min_age,
            region,
            behavior,
            interest,
            interest_id,
            life_event,
            isCustomizeGroup,
            group,
            rule_type,
            start_date,
            expired_date,
            campaign_objective,
            device_platform,
            user_os,
            gender,
            relationship_status,
            country,
            daily_budget,
            keyword,
            income,
            longtitude,
            latitude,
            radius_unit,
            country_code,
            province_name,
            province_code,
            postal_code,
            city_name,
            street_address,
            radius,
            campaginId_Faecbook,
            campaignId_Google,
            group_name,
            ad_campaign,
            created_by : old_created_by,
            created_by_name : old_created_by_name,
            created_user_type : old_created_user_type,
            action,
            action_by : created_by,
            action_by_name : created_by_name,
            action_by_user_type : created_user_type,
            approved_by : username,
            idx
        }

        this.campaignRuleHistory.create(createBody)

        if(action_id == 1) {

            this.campaignRule.update({ is_approved: true, is_rejected: false, approved_by: username, approved_at: Sequelize.literal("(now() at time zone 'utc')") }, { where: { id: rule_id } })
            //fb Adset Create

            if (rule_type == 'facebook') {
            //     const fbQuota = await this.campaignQuota.findOne({ where: { created_by_name: username }, attributes: ['facebook'] })
            //     const access_token=await (await this.campaignConfig.findOne({where:{created_user_type:1}})).user_access_token
            // const settings_info = await this.GetCampaignSettings(userinfo)
            // const adAccountId = await this.campaignConfig.findOne({
            //     attributes: ['ad_account_id'],
            //     where:{created_user_type:1}
            // })
            // const requestBody = {
            //   name: rule_name,
            //   optimization_goal: 'REACH',
            //   billing_event: 'IMPRESSIONS',
            //   bid_amount: 200,
            //   daily_budget: parseInt(daily_budget),
            //   campaignId: campaginId_Faecbook,
            //   country: country,
            //   interest: interest[0],
            //   interest_id: parseInt(interest_id[0]),
            //   start_time: start_date,
            //   status: 'PAUSED',
            //   adAccountId: '360233804653005',
            // };

            // const header = {
            //   Module: process.env.Module,
            //   Authorization: `Bearer ${process.env.Authorization}`,
            //   'Content-Type': 'application/json',
            // };

            // return new Promise((resolve, reject) => {
            //   axios
            //     .post(
            //       `${process.env.API_CALL_BASE_URL}/facebookAd/createAdset`,
            //       requestBody,
            //       { headers: header },
            //     )
            //     .then((result) => {
            //       console.info('facebook adGroup created');
            //       console.info(result.data.payload);
            //       resolve(result.data.payload);
            //     })
            //     .catch((err) => {
            //       reject(0);
            //     });
            // });
            
            }

            if (rule_type == 'google') {
                 
            }
            
            //google Adset Create
            //const googleClientId = settings_info['dataValues']['google_client_id']
            
        }
        else if(action_id == 2) {

            this.campaignRule.update({ is_rejected : true, is_approved: false, reject_msg, approved_by : username,approved_at : Sequelize.literal("(now() at time zone 'utc')")},{ where : { id : rule_id}})
        }
        else {

            this.campaignRule.destroy({ where : { id : rule_id}})
        }

        return true

    }

    async campaignRuleDelete(reqbody, userinfo) {
        const {id, username = null, roleid = 0, mobile=null, idx = 0} = userinfo

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`, created_by_name = username ? username : mobile

        const { rule_id } = reqbody
        
        const rule=await this.campaignRule.findOne({where: {
            [Op.and]: [
              { id: rule_id },
              { is_approved: true },
            ],
        }
        })

        if (rule) {
            const deletedRule = await this.campaignRule.destroy({ where: { id: rule_id } })
            
            return 'Rule Deteled Succesfully'
        }

        if (!rule) {
            return 'Rule Is Not Found'
        }
        

    }

//ad apis

    async createCampaignAd(reqbody, userinfo) {

        const {id, username = null, roleid = 0, mobile=null, idx = 0} = userinfo

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`, created_by_name = username ? username : mobile

        const {page_id, body, effective_instagram_media_id, image_url, image, link_url, campaign_id, thumbnail_height, thumbnail_width,instagram_actor_id,title, isInstagram, isFacebook, isGoogle,image_hash, is_fb_page_post, fb_page_post_category_ids,facebookpage_subcategory_localuids} = reqbody

        const createBody = {
            page_id,
            body,
            effective_instagram_media_id,
            image_url,
            image,
            link_url,
            thumbnail_height,
            thumbnail_width,
            instagram_actor_id,
            title,
            image_hash,
            campaign_id,
            is_fb_page_post,
            fb_page_post_category_ids,
            facebookpage_subcategory_localuids,
            created_by,
            created_by_name,
            created_user_type,
            action : "INSERT",
            action_by : created_by,
            action_by_name : created_by_name,
            action_by_user_type: created_user_type,
            idx,
            isInstagram,
            isFacebook,
            isGoogle
        }

        this.campaignAdHistory.create(createBody)

        return await this.campaignAd.create(createBody)
    }


    async campaignAdAction(reqbody,userinfo){
        
        let {id, username = null, roleid = 0} = userinfo, action = 'REJECTED'

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`

        //action_id = 1=> approve, action_id = 2=> reject, action_id = 3 => delete
        const {action_id = 2, ad_id, reject_msg = null} = reqbody

        action = (action_id == 1) ? 'APPROVED' : (action_id == 2) ? 'REJECTED' : 'DELETE'

        const adinfo = await this.campaignAd.findOne({ where : { id : ad_id} })

        if(!adinfo) {

            throw new NotFoundException()
        }

        if(adinfo['dataValues']['created_by'] == created_by && (action_id == 1 || action_id == 2)) {

            throw new BadRequestException('You cannot Approve/Reject it')
        }

        const {page_id, body,adset_id, account_id, effective_instagram_media_id, image_url, image, link_url, thumbnail_height, campaign_id, thumbnail_width,instagram_actor_id,title, image_hash, is_fb_page_post, fb_page_post_category_ids,facebookpage_subcategory_localuids, created_by_name, created_by : old_created_by = null, created_by_name: old_created_by_name = null, created_user_type : old_created_user_type = null, idx, isInstagram, isFacebook, isGoogle } = adinfo['dataValues']
        const createBody = {
            page_id,
            body,
            adset_id,
            account_id,
            effective_instagram_media_id,
            image_url,
            image,
            image_hash,
            link_url,
            campaign_id,
            thumbnail_height,
            thumbnail_width,
            instagram_actor_id,
            title,
            is_fb_page_post,
            fb_page_post_category_ids,
            facebookpage_subcategory_localuids,
            created_by : old_created_by,
            created_by_name : old_created_by_name,
            created_user_type : old_created_user_type,
            action,
            action_by : created_by,
            action_by_name : created_by_name,
            action_by_user_type : created_user_type,
            approved_by : username,
            idx,
            isInstagram,
            isFacebook,
            isGoogle
        }

        this.campaignAdHistory.create(createBody)

        if(action_id == 1) {

            this.campaignAd.update({ is_approved : true, is_rejected : false, approved_by : username, approved_at : Sequelize.literal("(now() at time zone 'utc')")},{ where : { id : ad_id}})
            //fb Adset Create
            const fbQuota=await this.campaignQuota.findOne({where:{created_by_name:username}, attributes:['facebook']})
            const settings_info = await this.GetCampaignSettings(userinfo)
            const adAccountId = await this.campaignConfig.findOne({
                attributes:['ad_account_id'],where:{created_user_type:1}
            })
            if (isFacebook == true) {
              const requestBody = {
                name: title,
                adAccountId: '360233804653005',
                page_id: page_id,
                image_hash: image_hash,
                link: image_url,
                message: 'try it out',
              };
      
              const header = {
                Module: process.env.FB_MODULE,
              };
      
              const fbCampaign = await axios.post(
                `${process.env.API_CALL_BASE_URL}/facebookAd/createAdcreative`,
                requestBody,
                { headers: header },
              );
              console.log(fbCampaign.data);
      
              if(fbCampaign.data.payload.id){
                  const adPublishBody = {
                      name: title,
                      adset_id: adset_id,
                      status:"PAUSED",
                      account_id: account_id,
                      creative_id: fbCampaign.data.payload.id,
                      adAccountId: '360233804653005'
                  }
                  const publisAd = await axios.post(`${process.env.API_CALL_BASE_URL}/facebookAd/createAd`, adPublishBody, { headers: header })
                  return publisAd.data
              }
            }
          
        
        }
        else if(action_id == 2) {

            this.campaignAd.update({ is_rejected : true, is_approved: false, reject_msg, approved_by : username,approved_at : Sequelize.literal("(now() at time zone 'utc')")},{ where : { id : ad_id}})
        }
        else {

            this.campaignAd.destroy({ where : { id : ad_id}})
        }

        return true




    }


    async getAllCampaignAdList(userinfo) {

        let {id, username = null, roleid = 0, idx = 0} = userinfo

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`

        idx = (created_user_type == 2 && idx) ? idx  : (created_user_type == 1) ? 0 : -1

        if(created_user_type == 1) {

            return this.campaignAd.findAll<CampaignAdModel>({ order : [['id','DESC']] })

        }
        else {

            return this.campaignAd.findAll<CampaignAdModel>({ where : { created_by, created_user_type, idx}, order :[['id','DESC']]})

        }
    }

    async editCampaignAd(reqbody, userinfo) {

        const {id, username = null, roleid = 0, mobile=null, idx = 0} = userinfo

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`, created_by_name = username ? username : mobile

        const {page_id, body, effective_instagram_media_id, image_url, image, campaign_id, image_hash, link_url, thumbnail_height, thumbnail_width,instagram_actor_id,title, isInstagram, is_fb_page_post, fb_page_post_category_ids,facebookpage_subcategory_localuids, isFacebook, isGoogle, id:ad_id} = reqbody

        const ad=await this.campaignAd.findOne({where: {
            [Op.and]: [
              { id: ad_id },
              { is_approved: true },
            ],
        }
        })

        const createBody = {
            page_id,
            body,
            effective_instagram_media_id,
            image_url,
            image,
            link_url,
            campaign_id,
            thumbnail_height,
            thumbnail_width,
            instagram_actor_id,
            title,
            image_hash,
            created_by,
            is_fb_page_post,
            fb_page_post_category_ids,
            facebookpage_subcategory_localuids,
            created_by_name,
            created_user_type,
            action : "UPDATE",
            action_by : created_by,
            action_by_name : created_by_name,
            action_by_user_type: created_user_type,
            idx,
            isInstagram,
            isFacebook,
            isGoogle,
            is_approved: false,
            is_rejected: false,
            approved_by: null,
            approved_at: null
        }
        
        if (ad) {
            
            this.campaignAd.update( createBody , { where: { id: ad_id } })
            
            return this.campaignAdHistory.create(createBody)
            
        } else {
            return 'No Ad found'
        }

        

        //return await this.campaignRule.create(createBody)
    }

   

// google and facebook campaign rule apis 15/9/2022

    async getAllGoogleFacebookCampaignRuleList(userinfo) {

        let {id, username = null, roleid = 0, idx = 0} = userinfo
  
        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`
  
        idx = (created_user_type == 2 && idx) ? idx : (created_user_type == 1) ? 0 : -1
        
        let arranged_data=[]
  
        if(created_user_type == 1) {
  
            const combined_rule = await this.googleFacebookCampaignRepo.findAll<GoogleFacebookCampaignRuleModel>({ order : [['id','DESC']] })
        
            combined_rule.map((s_rule) => {
                let facebook_data = {
                    objective: s_rule.objective,
                    facebook_status: s_rule.facebook_status,
                    special_ad_categories: s_rule.special_ad_categories,
                    
                }
                let google_data = {
                    google_advertising_channel_type: s_rule.google_advertising_channel_type,
                   
                    google_status:s_rule.google_status
                }
                let common_data = {
                    id: s_rule.id,
                    name: s_rule.name,
                    created_by_name: s_rule.created_by_name,
                    created_by: s_rule.created_by,
                    approved_at: s_rule.approved_at,
                    is_approved: s_rule.is_approved,
                    is_rejected: s_rule.is_rejected,
                    reject_msg: s_rule.reject_msg,
                    action: s_rule.action,
                    action_by: s_rule.action_by,
                    action_by_name: s_rule.action_by_name,
                    action_at: s_rule.action_at,
                    action_by_user_type: s_rule.action_by_user_type,
                    idx: s_rule.idx,
                    business_id: s_rule.business_id,
                    budget_id: s_rule.budget_id,
                    campaign_type:s_rule.campaign_type
                }
                arranged_data.push({common_data,google_data,facebook_data})
            })
            
            return arranged_data
  
        }
        else {
  
            const combined_rule = await this.googleFacebookCampaignRepo.findAll<GoogleFacebookCampaignRuleModel>({ where: { created_by, created_user_type, idx }, order: [['id', 'DESC']] })
            
          return combined_rule
        }
    }
  

  
    async createGoogleFacebookCampaignRule(reqbody, userinfo) {
  
      const {id, username = null, roleid = 0, mobile=null, idx = 0} = userinfo
  
      const created_user_type = (username && roleid) ? 1 : 2
      const created_by = `${id}`, created_by_name = username ? username : mobile
  
      // const {name, amount, status, advertisingChannelType, customerId, CampaignId, budget_id} = reqbody
      const {name, objective, facebook_status, special_ad_categories, adAccountId, business_id,google_advertising_channel_type,budget_id,google_status,campaign_type, fbamount,googleamount} = reqbody
  
      const createBody = {
          name, 
          objective,
          facebook_status, 
          special_ad_categories, 
          adAccountId,
          created_by,
          created_by_name,
          created_user_type,
          action : "INSERT",
          action_by : created_by,
          action_by_name : created_by_name,
          action_by_user_type: created_user_type,
          idx,
          business_id,
          google_advertising_channel_type,
          budget_id,
          google_status,
          campaign_type,
          fbamount,
          googleamount
      }
  
      try {
        this.googleFacebookCampaignHistoryRepo.create(createBody);
      } catch (error) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'An error occurred',
            message: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
  
      return await this.googleFacebookCampaignRepo.create(createBody)
  }


    async editGoogleFacebookCampaignRule(reqbody, userinfo) {
    
        const {id, username = null, roleid = 0, mobile=null, idx = 0} = userinfo
    
        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`, created_by_name = username ? username : mobile
    
        const {name, objective, facebook_status, special_ad_categories, adAccountId, business_id,google_advertising_channel_type,budget_id,google_status,campaign_type,  fbamount,
            googleamount, id:campaign_id} = reqbody
        
    
        // if(campaign_type === "facebook"){

            const rule = await this.googleFacebookCampaignRepo.findOne({where:{
                [Op.and]: [
                    { id: campaign_id},
                    { is_approved: true },
                  ],
            }})


            const createBody = {
                
                name, 
                objective,
                facebook_status, 
                special_ad_categories, 
                adAccountId,
                created_by,
                created_by_name,
                created_user_type,
                action : "UPDATE",
                action_by : created_by,
                action_by_name : created_by_name,
                action_by_user_type: created_user_type,
                idx,
                business_id,
                is_approved: false,
                is_rejected: false,
                approved_by: null,
                approved_at: null,
                google_advertising_channel_type,
                budget_id,
                google_status,
                campaign_type,
                fbamount,
                googleamount
            }

        if (rule) {
    
            this.googleFacebookCampaignRepo.update(createBody, { where: { id: campaign_id } })
    
            return this.googleFacebookCampaignHistoryRepo.create(createBody)
    
        } else {
            return 'No Rule found'
        }
    
        
    
        
    }

    async googleFacebookCampaignRuleAction(reqbody,userinfo){
          
        let {id, username = null, roleid = 0} = userinfo, action = 'REJECTED'
        let adinfo
        let createBody = {}
        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`

        //action_id = 1=> approve, action_id = 2=> reject, action_id = 3 => delete
        const {action_id = 2, rule_id, reject_msg = null} = reqbody

        action = (action_id == 1) ? 'APPROVED' : (action_id == 2) ? 'REJECTED' : 'DELETE'


            adinfo = await this.googleFacebookCampaignRepo.findOne({where:{id:rule_id}})

            if(!adinfo) {

                throw new NotFoundException()
            }

            if(adinfo['dataValues']['created_by'] == created_by && (action_id == 1 || action_id == 2)) {

                throw new BadRequestException('You cannot Approve/Reject it')
            }

            const { name, objective, facebook_status, special_ad_categories, adAccountId,google_advertising_channel_type,budget_id,google_status,campaign_type, fbamount,
                googleamount, created_by_name, created_by : old_created_by = null, created_by_name: old_created_by_name = null, created_user_type : old_created_user_type = null, idx, business_id } = adinfo['dataValues']
             createBody = {
    
                 name,
                 objective,
                 facebook_status,
                 special_ad_categories,
                 adAccountId,
                 google_advertising_channel_type,
                 budget_id,
                 google_status,
                 campaign_type,
                 fbamount,
                 googleamount,
                created_by : old_created_by,
                created_by_name : old_created_by_name,
                created_user_type : old_created_user_type,
                action,
                action_by : created_by,
                action_by_name : created_by_name,
                action_by_user_type : created_user_type,
                approved_by : username,
                idx,
                business_id
            }
    

            this.googleFacebookCampaignHistoryRepo.create(createBody)



        if(action_id == 1) {

          

            this.googleFacebookCampaignRepo.update({ is_approved: true, is_rejected: false, approved_by: username, approved_at: Sequelize.literal("(now() at time zone 'utc')") }, { where: { id: rule_id } })
                
            const requestBody = {
              name,
              objective,
              status: 'PAUSED',
              special_ad_categories,
              adAccountId: '360233804653005',
            };
            const headers = {
              Module: process.env.Module,
              Authorization: `Bearer ${process.env.Authorization}`,
              'Content-Type': 'application/json',
            };
            console.info(headers);
            try {
              const CreateFaceBookCampaign = await axios.post(
                `${process.env.API_CALL_BASE_URL}/facebookAd/createCampaign`,
                requestBody,
                { headers },
              );
              console.info(CreateFaceBookCampaign);
            } catch (err) {
              throw new HttpException(
                {
                  status: HttpStatus.INTERNAL_SERVER_ERROR,
                  error: 'An error occurred',
                  message: err.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
              );
            }
        }
        else if(action_id == 2) {

                this.googleFacebookCampaignRepo.update({ is_approved: false, is_rejected: true, approved_by: username, approved_at: Sequelize.literal("(now() at time zone 'utc')") }, { where: { id: rule_id } })

           

        }
        else {
           

                this.googleFacebookCampaignRepo.destroy({ where : { id : rule_id}})
           
          

        }

        return true

    }

     //campaign promotion

     async createCampaignPromotion(reqbody, userinfo) {

        const {id, username = null, roleid = 0, mobile=null, idx = 0} = userinfo

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`, created_by_name = username ? username : mobile

        const {title, campaign_id, description, merchant_id, rule_id, promotion_type, is_global, image_urls, mobile_image_urls, group_id} = reqbody

        const createBody = {
            title,
            campaign_id,
            description,
            merchant_id,
            rule_id,
            promotion_type,
            is_global,
            image_urls,
            mobile_image_urls,
            group_id,
            created_by,
            created_by_name,
            created_user_type,
            action : "INSERT",
            action_by : created_by,
            action_by_name : created_by_name,
            action_by_user_type: created_user_type,
            idx,
        }

        const created_ad_promo = await this.campaignPromotionTemp.create(createBody)
        await this.campaignPromotionHistory.create(createBody)

        return created_ad_promo
    }


    async getAllCampaignPromotionList(userinfo) {

        let {id, username = null, roleid = 0, idx = 0} = userinfo

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`

        idx = (created_user_type == 2 && idx) ? idx  : (created_user_type == 1) ? 0 : -1

        if(created_user_type == 1) {

            return this.campaignPromotion.findAll<CampaignPromotionModel>({ order : [['id','DESC']] })

        }
        else {

            return this.campaignPromotion.findAll<CampaignPromotionModel>({ where : { created_by, created_user_type, idx}, order :[['id','DESC']]})

        }
    }

    async pendingCampaignPromotionList(userinfo) {

        let {id, username = null, roleid = 0, idx = 0} = userinfo
    
        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`
    
        idx = (created_user_type == 2 && idx) ? idx  : (created_user_type == 1) ? 0 : -1
    
        if(created_user_type == 1) {
    
            return this.campaignPromotionTemp.findAll<CampaignPromotionTempModel>({ order : [['id','DESC']] })
    
        }
        else {
    
            return this.campaignPromotionTemp.findAll<CampaignPromotionTempModel>({ where : { created_by, created_user_type, idx}, order :[['id','DESC']]})
    
        }
    }

    async campaignPromotionAction(reqbody,userinfo){
        
        let {id, username = null, roleid = 0} = userinfo, action = 'REJECTED'

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`

        //action_id = 1=> approve, action_id = 2=> reject, action_id = 3 => delete
        const {action_id = 2, promotion_id, reject_msg = null} = reqbody

        action = (action_id == 1) ? 'APPROVED' : (action_id == 2) ? 'REJECTED' : 'DELETE'

        

        if (action_id == 1) {
            const adinfo = await this.campaignPromotionTemp.findOne({ where : { id : promotion_id} })

        const {title, campaign_id, description, merchant_id, rule_id, promotion_type, is_global, image_urls,mobile_image_urls, group_id, created_by_name, created_by : old_created_by = null, created_by_name: old_created_by_name = null, created_user_type : old_created_user_type = null, idx, isInstagram, isFacebook, isGoogle, update_id } = adinfo['dataValues']
        const createBody = {
            title,
            campaign_id,
            description,
            merchant_id,
            rule_id,
            promotion_type,
            is_global,
            image_urls,
            mobile_image_urls,
            group_id,
            created_by : old_created_by,
            created_by_name : old_created_by_name,
            created_user_type : old_created_user_type,
            action,
            action_by : created_by,
            action_by_name : created_by_name,
            action_by_user_type : created_user_type,
            approved_by : username,
            idx,
            isInstagram,
            isFacebook,
            isGoogle,
            update_id
        }

        this.campaignPromotionHistory.create(createBody)
            if(!adinfo) {

                throw new NotFoundException()
            }
    
            if(adinfo['dataValues']['created_by'] == created_by && (action_id == 1 || action_id == 2)) {
    
                throw new BadRequestException('You cannot Approve/Reject it')
            }
            
            if (adinfo['dataValues'].action == 'DELETE') { 
                this.campaignPromotion.destroy({ where : { id : update_id}})
                this.campaignPromotionTemp.destroy({ where: { id: promotion_id } })
                return true
            }
            if (adinfo['dataValues'].action == 'UPDATE') { 
      
                this.campaignPromotion.update({ ...createBody, is_approved: true, is_rejected: false, approved_by: username, approved_at: Sequelize.literal("(now() at time zone 'utc')") }, { where: { id: update_id } })              
                  
                this.campaignPromotionTemp.destroy( { where: { id: promotion_id } })
                return true
            } else {
                this.campaignPromotion.create({ ...createBody, is_approved : true, is_rejected : false, approved_by : username, approved_at : Sequelize.literal("(now() at time zone 'utc')")})

                this.campaignPromotionTemp.destroy( { where: { id: promotion_id } })
                return true
            }

           }
        else if(action_id == 2) {
            const adinfo = await this.campaignPromotionTemp.findOne({ where : { id : promotion_id} })

        const {title, campaign_id, description, merchant_id, rule_id, promotion_type, is_global, image_urls, mobile_image_urls, group_id, created_by_name, created_by : old_created_by = null, created_by_name: old_created_by_name = null, created_user_type : old_created_user_type = null, idx, isInstagram, isFacebook, isGoogle, update_id } = adinfo['dataValues']
        const createBody = {
            title,
            campaign_id,
            description,
            merchant_id,
            rule_id,
            promotion_type,
            is_global,
            image_urls,
            mobile_image_urls,
            group_id,
            created_by : old_created_by,
            created_by_name : old_created_by_name,
            created_user_type : old_created_user_type,
            action,
            action_by : created_by,
            action_by_name : created_by_name,
            action_by_user_type : created_user_type,
            approved_by : username,
            idx,
            isInstagram,
            isFacebook,
            isGoogle,
            update_id
        }

        this.campaignPromotionHistory.create(createBody)
            if(!adinfo) {

                throw new NotFoundException()
            }
    
            if(adinfo['dataValues']['created_by'] == created_by && (action_id == 1 || action_id == 2)) {
    
                throw new BadRequestException('You cannot Approve/Reject it')
            }
            if (adinfo['dataValues'].action == 'DELETE') { 
                this.campaignPromotion.update({ is_approved: false, is_rejected: true, reject_msg, approved_by: null, approved_at: null, action: 'APPROVED' }, { where: { id: update_id } })
           
                this.campaignPromotionTemp.destroy({ where: { id: promotion_id } })
                return true
            }
            if (adinfo['dataValues'].action == 'UPDATE') { 
      
                this.campaignPromotion.update({ is_approved: false, is_rejected: true, reject_msg, approved_by: username, approved_at: Sequelize.literal("(now() at time zone 'utc')") }, { where: { id: update_id } })              
                  
                this.campaignPromotionTemp.destroy( { where: { id: promotion_id } })
                return true
            } else {
                this.campaignPromotionTemp.destroy( { where: { id: promotion_id } })
                return true
            }
        }
        else {
            
            const approveinfo = await this.campaignPromotion.findOne({ where : { id : promotion_id} })
            console.log(approveinfo)
            if(!approveinfo) {

                throw new NotFoundException()
            }

            if(approveinfo['dataValues']['created_by'] == created_by && (action_id == 1 || action_id == 2)) {

                throw new BadRequestException('You cannot Approve/Reject it')
            }

            const {title, campaign_id, description, merchant_id, rule_id, promotion_type, is_global, image_urls,mobile_image_urls, group_id, created_by_name, created_by : old_created_by = null, created_by_name: old_created_by_name = null, created_user_type : old_created_user_type = null, idx, isInstagram, isFacebook, isGoogle, update_id } = approveinfo['dataValues']
            const createBody = {
                title,
                campaign_id,
                description,
                merchant_id,
                rule_id,
                promotion_type,
                is_global,
                image_urls,
                mobile_image_urls,
                group_id,
                created_by : old_created_by,
                created_by_name : old_created_by_name,
                created_user_type : old_created_user_type,
                action,
                action_by : created_by,
                action_by_name : created_by_name,
                action_by_user_type : created_user_type,
                approved_by : username,
                idx,
                isInstagram,
                isFacebook,
                isGoogle,
                update_id
            }

            this.campaignPromotionHistory.create(createBody)

            this.campaignPromotion.update({ is_approved: false, is_rejected: false, approved_by: null, approved_at: null, action: 'DELETE' }, { where: { id: promotion_id } })
        
            this.campaignPromotionTemp.create({...createBody, is_approved: false, is_rejected: false, update_id:approveinfo.id ,approved_by: null, approved_at: null, action: 'DELETE'})
        }

        return true




    }


    async editCampaignPromotion(reqbody, userinfo) {

        const {id, username = null, roleid = 0, mobile=null, idx = 0} = userinfo

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`, created_by_name = username ? username : mobile

        const {title, campaign_id, description, merchant_id, rule_id, promotion_type, is_global, image_urls,mobile_image_urls, group_id, id:promotion_id} = reqbody

        const rule=await this.campaignPromotion.findOne({where: {
            [Op.and]: [
              { id: promotion_id },
              { is_approved: true },
            ],
        }
        })

        const createBody = {
            title,
            campaign_id,
            description,
            merchant_id,
            rule_id,
            promotion_type,
            is_global,
            image_urls,
            mobile_image_urls,
            group_id,
            created_by,
            created_by_name,
            created_user_type,
            action : "UPDATE",
            action_by : created_by,
            action_by_name : created_by_name,
            action_by_user_type: created_user_type,
            idx,
            is_approved: false,
            is_rejected: false,
            approved_by: null,
            approved_at: null
        }
        
        if (rule) {
            
            this.campaignPromotion.update( { is_approved: false, is_rejected: false, approved_by: null, approved_at: null, action : "UPDATE" } , { where: { id: promotion_id} })
            this.campaignPromotionTemp.create({...createBody, update_id:promotion_id})
            return this.campaignPromotionHistory.create(createBody)
            
        } else {
            return 'No Promotion found'
        }

        

        //return await this.campaignRule.create(createBody)
    }



}
