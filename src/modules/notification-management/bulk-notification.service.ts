import { Injectable, Inject, NotFoundException, BadRequestException,Logger, InternalServerErrorException } from '@nestjs/common';
import {CampaignCusGroupModel, CampaignCusGroupTempModel, CampaignCusGroupHistoryModel,CampaignCusGroupMapModel, CampaignCusGroupMapTempModel,
    CampaignBulkNotificationByGroupModel, CampaignBulkNotificationByGroupTempModel, CampaignBulkNotificationByGroupHistoryModel, CampaignBulkNotificationWithoutGroupModel,
    CampaignBulkNotificationWithoutGroupTempModel, CampaignBulkNotificationWithoutGroupHistoryModel, CampaignBulkNotificationChannelMapModel, CampaignConfigModel, GroupBaseModel, CampaignQuotaModel, CampaignGroupModel, CampaignNotificationFinalModel, BonusServiceCampaignModel } from '../../models';

import {
    CAMPAIGN_CUS_GROUP_REPO,
    REDIS_CONNECTION, QUEUE_NAME,CAMPAIGN_CUS_GROUP_TEMP_REPO, CAMPAIGN_CUS_GROUP_HISTORY_REPO, CAMPAIGN_CUS_GROUP_MAP_REPO, CAMPAIGN_CUS_GROUP_MAP_TEMP_REPO,
CAMPAIGN_BULK_NOTI_BY_GROUP_REPO,CAMPAIGN_BULK_NOTI_BY_GROUP_TEMP_REPO,CAMPAIGN_BULK_NOTI_BY_GROUP_HISTORY_REPO, CAMPAIGN_BULK_NOTI_WITHOUT_GROUP_REPO,
CAMPAIGN_BULK_NOTI_WITHOUT_GROUP_TEMP_REPO, CAMPAIGN_BULK_NOTI_WITHOUT_GROUP_HISTORY_REPO, CAMPAIGN_BULK_NOTI_CHANNEL_MAP_REPO, CampaignConfigModel_REPOSITORY, GROUP_BASE, CAMPAIGN_QUOTA_REPOSITORY, CAMPAIGN_GROUP, NOTIFICATION_FINAL, BONUS_SERVICE_CAMPAIGN } from '../../config/constants';

import { json, Op } from 'sequelize'
import { ClientKafka } from '@nestjs/microservices';
import { Queue } from 'bull';
import { RedisClientType } from 'redis';
import { InjectQueue } from '@nestjs/bull';
import {secondDiffBetweenTwoDateTimes} from '../../helpers/utils'
import {NotificationCreateDto} from '../../dto/notification.dto'
import { Sequelize } from 'sequelize-typescript';
import { async, Subject } from 'rxjs';
import moment from 'moment'
import axios from 'axios';


@Injectable()
export class BulkNotificationService {
    constructor(
        @Inject('kafka_module')
        private readonly client: ClientKafka,
        @Inject(CAMPAIGN_CUS_GROUP_REPO) private readonly cusGroupRepo: typeof CampaignCusGroupModel,
        @Inject(CAMPAIGN_CUS_GROUP_TEMP_REPO) private readonly cusGroupTempRepo: typeof CampaignCusGroupTempModel,
        @Inject(CAMPAIGN_CUS_GROUP_HISTORY_REPO) private readonly cusGroupHistoryRepo: typeof CampaignCusGroupHistoryModel,

        @Inject(CAMPAIGN_CUS_GROUP_MAP_REPO) private readonly cusGroupMapRepo: typeof CampaignCusGroupMapModel,
        @Inject(CAMPAIGN_CUS_GROUP_MAP_TEMP_REPO) private readonly cusGroupMapTempRepo: typeof CampaignCusGroupMapTempModel,

        @Inject(CAMPAIGN_BULK_NOTI_CHANNEL_MAP_REPO) private readonly bulkNotificationChannelMapRepo: typeof CampaignBulkNotificationChannelMapModel,
        @Inject(CAMPAIGN_GROUP) private readonly campaignGroup: typeof CampaignGroupModel,


        @Inject(CAMPAIGN_BULK_NOTI_BY_GROUP_REPO) private readonly bulkNotificationByGroupRepo: typeof CampaignBulkNotificationByGroupModel,
        @Inject(CAMPAIGN_BULK_NOTI_BY_GROUP_TEMP_REPO) private readonly bulkNotificationByGroupTempRepo: typeof CampaignBulkNotificationByGroupTempModel,
        @Inject(CAMPAIGN_BULK_NOTI_BY_GROUP_HISTORY_REPO) private readonly bulkNotificationByGroupHistoryRepo: typeof CampaignBulkNotificationByGroupHistoryModel,
        @Inject(GROUP_BASE) private readonly groupBase: typeof GroupBaseModel,

        @Inject(CAMPAIGN_BULK_NOTI_WITHOUT_GROUP_REPO) private readonly bulkNotificationWithoutGroupRepo: typeof CampaignBulkNotificationWithoutGroupModel,
        @Inject(CAMPAIGN_BULK_NOTI_WITHOUT_GROUP_TEMP_REPO) private readonly bulkNotificationWithoutGroupTempRepo: typeof CampaignBulkNotificationWithoutGroupTempModel,
        @Inject(CAMPAIGN_BULK_NOTI_WITHOUT_GROUP_HISTORY_REPO) private readonly bulkNotificationWithoutGroupHistoryRepo: typeof CampaignBulkNotificationWithoutGroupHistoryModel,
        @Inject(CampaignConfigModel_REPOSITORY) private readonly campaignConfig: typeof CampaignConfigModel,
        @Inject(CAMPAIGN_QUOTA_REPOSITORY) private readonly campaignQuota: typeof CampaignConfigModel,
        @Inject(NOTIFICATION_FINAL) private readonly notificationFinalRepo: typeof CampaignNotificationFinalModel,
        @Inject(BONUS_SERVICE_CAMPAIGN) private readonly bonusServiceCampaign: typeof BonusServiceCampaignModel,
        @Inject(REDIS_CONNECTION) private redisClient: RedisClientType,
        private readonly logger: Logger,
        @InjectQueue(QUEUE_NAME) private testQueue: Queue

    ) { }

    async createBulkNotificationGroup(reqbody, userinfo) {

        let { id, username = null, roleid = 0, mobile = null, idx = 0, subuser_id = 0 } = userinfo, successData = [], errorData = [], group_map_createBody = [], need_to_wait = false, wait_msg = null

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = subuser_id ? `${subuser_id}` : `${id}`, created_by_name = username ? username : mobile

        const { group_name, idx: m_idx = 0, group_map = [] } = reqbody

        //is it created by admin on behave of merchent or created by from merchent end or created for only admin uses...link with idx..
        idx = m_idx ? m_idx : idx

        const groupCreateBody = {
            group_name,
            created_by,
            created_by_name,
            created_user_type,
            idx,
            action: 'INSERT'
        }
        const groupResponse = await this.cusGroupTempRepo.create(groupCreateBody)

        group_map.map(item => {

            group_map_createBody.push({

                group_id: groupResponse['dataValues']['id'],
                msisdn: item.msisdn,
                email: item['email'] ? item['email'] : null
            })
        })

        errorData = [{ msisdn: '123456789', email: 'mmm@gmail.com', error_msg: 'msisdn is not exist in customer profile' }, { msisdn: '123456777', email: null, error_msg: 'need email address of this customer' }]

        await this.cusGroupMapTempRepo.bulkCreate(group_map_createBody)

        //create history...
        this.cusGroupHistoryRepo.create(groupCreateBody)

        return {
            successData: group_map_createBody,
            errorData,
            need_to_wait,
            wait_msg
        }

    }

    //approve group_list, my pending group_list, other pending group_list.. for merchent
    async bulkNotificationGroupList(userinfo) {

        let { id, username = null, roleid = 0, mobile = null, idx = 0, subuser_id = 0 } = userinfo

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = subuser_id ? `${subuser_id}` : `${id}`, created_by_name = username ? username : mobile

        idx = (created_user_type == 2 && idx) ? idx : -1

        //for merchent / merchent user..
        if (created_user_type == 2) {

            const GroupList = await this.cusGroupRepo.findAll({ where: { idx } })

            const myPendingGroupList = await this.cusGroupTempRepo.findAll({ where: { idx, created_by } })
    
            const approveGroupList = await this.cusGroupTempRepo.findAll({ where: { idx, created_by: { [Op.ne]: created_by } } })
    
            return { GroupList, myPendingGroupList, approveGroupList }
        }

        else if (created_user_type == 1) {

            //for admin/ admin user..
            const GroupList = await this.cusGroupRepo.findAll({ where: { created_user_type } })

            const myPendingGroupList = await this.cusGroupTempRepo.findAll({ where: { created_by, created_user_type } })
    
            const approveGroupList = await this.cusGroupTempRepo.findAll({ where: { created_user_type, created_by: { [Op.ne]: created_by } } })
    
            return { GroupList, myPendingGroupList, approveGroupList }
        }
        else {

            //for unknown...
            return { GroupList: [], myPendingGroupList: [], approveGroupList: [] }
        }

    }

    async bulkNotificationGroupDetails(reqbody, userinfo) {

        const { group_id, is_pending = false } = reqbody

        if (is_pending) {

            return await this.cusGroupMapTempRepo.findAll({ where: { group_id } })
        }
        else {

            return await this.cusGroupMapRepo.findAll({ where: { group_id } })
        }
    }

    async bulkNotificationGroupAction(reqbody, userinfo) {

        let { id, username = null, roleid = 0, subuser_id = 0 } = userinfo, action = 'REJECTED', group_map_createBody = []

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = subuser_id ? `${subuser_id}` : `${id}`

        //action_id = 1=> approve, action_id = 2=> reject, action_id = 3 => delete
        const { action_id = 2, group_id, reject_msg = null } = reqbody

        action = (action_id == 1) ? 'APPROVED' : (action_id == 2) ? 'REJECTED' : 'DELETE'

        const cusGroupTemp = await this.cusGroupTempRepo.findOne({ where: { id: group_id } })

        if (!cusGroupTemp) {

            throw new NotFoundException()
        }

        if (cusGroupTemp['dataValues']['created_by'] == created_by && (action_id == 1 || action_id == 2)) {

            throw new BadRequestException('You cannot Approve/Reject it')
        }

        const { old_id, group_name, created_by_name, created_by: old_created_by = null, created_by_name: old_created_by_name = null, created_user_type: old_created_user_type = null, idx, action: old_action } = cusGroupTemp['dataValues']

        const groupCreateBody = {
            group_name,
            created_by,
            created_by_name,
            created_user_type,
            idx,
            action: `${old_action}-${action}`,
            approved_by: username,
            approved_at: Sequelize.literal("(now() at time zone 'utc')")
        }

        if (old_action == "INSERT") {

            //approve
            if (action_id == 1) {

                const groupResponse = await this.cusGroupRepo.create(groupCreateBody)

                this.cusGroupMapTempRepo.findAll({ where: { group_id } }).then(data => {

                    data.map(item => {

                        group_map_createBody.push({
            
                            group_id: groupResponse['dataValues']['id'],
                            msisdn: item['dataValues']['msisdn'],
                            email: item['dataValues']['email'],
                        })
                    })

                    this.cusGroupMapRepo.bulkCreate(group_map_createBody).then(d => {

                        this.cusGroupTempRepo.destroy({ where: { id: group_id } })
                        this.cusGroupMapTempRepo.destroy({ where: { group_id } })

                        //create history...
                        this.cusGroupHistoryRepo.create(groupCreateBody)

                    }).catch(e => {

                        //roll back..
                        this.cusGroupRepo.destroy({ where: { id: groupResponse['dataValues']['id'] } })
        
                    })

                }).catch(e => {

                    //roll back..
                    this.cusGroupRepo.destroy({ where: { id: groupResponse['dataValues']['id'] } })

                })
            }
            //reject or delete...
            else {

                this.cusGroupTempRepo.destroy({ where: { group_id } })
                this.cusGroupMapTempRepo.destroy({ where: { group_id } })
                this.cusGroupHistoryRepo.create(groupCreateBody)

            }
        }
        else if (old_action == "UPDATE") {

            //approve
            if (action_id == 1) {
                this.cusGroupRepo.update(groupCreateBody, { where: { id: old_id } })
                this.cusGroupHistoryRepo.create(groupCreateBody)
                this.cusGroupTempRepo.destroy({ where: { id: group_id } })
            }
            //reject or delete...
            else {

                this.cusGroupHistoryRepo.create(groupCreateBody)
                this.cusGroupTempRepo.destroy({ where: { group_id } })

            }
        }
        else if (old_action == "DELETE") {

            //approve
            if (action_id == 1) {
                this.cusGroupRepo.destroy({ where: { id: old_id } })
                this.cusGroupHistoryRepo.create(groupCreateBody)
                this.cusGroupTempRepo.destroy({ where: { id: group_id } })

                //delete all ntifications....
                this.bulkNotificationByGroupRepo.destroy({ where: { group_id } })
                this.bulkNotificationByGroupTempRepo.destroy({ where: { group_id } })

            }
            //reject or delete...
            else {

                this.cusGroupHistoryRepo.create(groupCreateBody)
                this.cusGroupTempRepo.destroy({ where: { group_id } })

            }
        }

        //success..
        return true

    }

    async bulkNotificationGroupActionMain(reqbody, userinfo) {

        let { id, username = null, roleid = 0, subuser_id = 0 } = userinfo, action = 'UPDATE', group_map_createBody = []

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = subuser_id ? `${subuser_id}` : `${id}`

        //action_id = 1=> delete, other => edit
        let { action_id = 1, group_id, group_name = null } = reqbody

        action = (action_id == 1) ? 'DELETE' : 'UPDATE'

        const cusGroup = await this.cusGroupRepo.findOne({ where: { id: group_id } })

        if (!cusGroup) {

            throw new NotFoundException()
        }


        const { id: old_id, group_name: old_group_name, created_by_name, created_by: old_created_by = null, created_by_name: old_created_by_name = null, created_user_type: old_created_user_type = null, idx } = cusGroup['dataValues']

        const tempinfo = await this.cusGroupTempRepo.findOne({ where: { old_id: group_id } })

        if (tempinfo) {

            throw new BadRequestException('Already have in pending list')
        }

        group_name = (action_id == 1) ? old_group_name : group_name ? group_name : old_group_name

        const groupTempCreateBody = {
            group_name,
            created_by,
            created_by_name,
            created_user_type,
            idx,
            action,
            old_id
        }

        await this.cusGroupTempRepo.create(groupTempCreateBody)
        this.cusGroupHistoryRepo.create(groupTempCreateBody)

        //success..
        return true

    }

    //bulk notification......

    async emitKafkaPushNotif(data) {
        this.logger.log('Messeage Send -> ' + JSON.stringify(data));
        return this.client.emit(process.env.KAFKA_FINAL_NOTIFICATION_TOPIC, JSON.stringify(data))
      }
    async bulkNotificationCreateWithGroup(reqbody, userinfo) {

        let { id, username = null, roleid = 0, mobile = null, idx = 0, subuser_id = 0 } = userinfo

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = subuser_id ? `${subuser_id}` : `${id}`, created_by_name = username ? username : mobile

        const { group_id, isScheduled, rule_id, effective_date, expiry_date, repeat_type, isRepeat,qouta_id, repeat_start_date, repeat_day,repeat_month_day, adRule_id, is_rule_base_notification, is_Ad, isAdScheduled, repeat_time, startDate, endDate,fb_page_post_body,fb_page_post_image, sms_body,push_notification_title,push_notification_body,push_notification_image,
            email_title,email_body,email_attachment,instagram_body,instagram_image, sms_from, push_from, status=0, fb_page_post = false, sms = false, push_notification = false, email = false, whatsapp = false, instagram = false, twitter = false, m_idx = 0, fb_page_post_category_ids = [], facebookpage_subcategory_ids = [] } = reqbody

        //is it created by admin on behave of merchent or created by from merchent end or created for only admin uses...link with idx..
        idx = m_idx ? m_idx : idx

        const channeMap = await this.bulkNotificationChannelMapRepo.create({ fb_page_post, sms, push_notification, email, whatsapp, instagram, twitter,fb_page_post_body,fb_page_post_image, sms_body,push_notification_title,push_notification_body,push_notification_image,email_title,email_body,email_attachment,instagram_body,instagram_image })
        

        const groupCreateBody = {
            group_id,
            rule_id,
            isScheduled,
            effective_date:effective_date == '' ? Sequelize.literal("(now() at time zone 'utc')"): effective_date ,
            expiry_date: expiry_date == '' ? Sequelize.literal("(now() at time zone 'utc')"): expiry_date,
            repeat_type,
            isRepeat,
            qouta_id,
            adRule_id,
            sms_from,
            push_from,
            status,
            repeat_time,
            repeat_start_date,
            repeat_day,
            repeat_month_day,
            is_rule_base_notification,
            is_Ad,
            isAdScheduled,
            startDate: startDate=='' ? Sequelize.literal("(now() at time zone 'utc')"): startDate,
            endDate: endDate== '' ? Sequelize.literal("(now() at time zone 'utc')"): endDate,
            channel_map_id: channeMap['dataValues']['id'],
            created_by,
            created_by_name,
            created_user_type,
            idx,
            action: 'INSERT',
            fb_page_post_category_ids,
            facebookpage_subcategory_ids
        }

        this.bulkNotificationByGroupHistoryRepo.create(groupCreateBody)

        return await this.bulkNotificationByGroupTempRepo.create(groupCreateBody)
    }

    async bulkNotificationListWithGroup(userinfo) {

        let { id, username = null, roleid = 0, mobile = null, idx = 0, subuser_id = 0 } = userinfo

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = subuser_id ? `${subuser_id}` : `${id}`, created_by_name = username ? username : mobile

        idx = (created_user_type == 2 && idx) ? idx : -1

        //for merchent / merchent user..
        if (created_user_type == 2) {

            const NotificationList = await this.bulkNotificationByGroupRepo.findAll({
                where: { idx },
                include: [
                    {
                        model: CampaignBulkNotificationChannelMapModel
                    },
                    {
                        model: CampaignGroupModel,
                        
                    }
                ],
                order: [['created_at', 'DESC']]
            })

            const myPendingNotificationList = await this.bulkNotificationByGroupTempRepo.findAll({
                where: { idx, created_by },
                include: [
                    {
                        model: CampaignBulkNotificationChannelMapModel
                    },
                    {
                        model: CampaignGroupModel,
                        
                    }
                ],
                order: [['created_at', 'DESC']]
            })
    
            const PendingNotificationList = await this.bulkNotificationByGroupTempRepo.findAll({
                where: { idx, created_by: { [Op.ne]: created_by } },
                include: [
                    {
                        model: CampaignBulkNotificationChannelMapModel
                    },
                    {
                        model: CampaignGroupModel,
                       
                    }
                ],
                order: [['created_at', 'DESC']]
            })
    
            return { NotificationList, myPendingNotificationList, PendingNotificationList }
        }

        else if (created_user_type == 1) {

            //for admin/ admin user..
            const NotificationList = await this.bulkNotificationByGroupRepo.findAll({
                where: { created_user_type },
                include: [
                    {
                        model: CampaignBulkNotificationChannelMapModel
                    },
                    {
                        model: CampaignGroupModel,
                      
                    }
                ],
                order: [['created_at', 'DESC']]
            })

            const myPendingNotificationList = await this.bulkNotificationByGroupTempRepo.findAll({
                where: { created_by, created_user_type },
                include: [
                    {
                        model: CampaignBulkNotificationChannelMapModel
                    },
                    {
                        model: CampaignGroupModel,
                    }
                ],
                order: [['created_at', 'DESC']]
            })
    
            const PendingNotificationList = await this.bulkNotificationByGroupTempRepo.findAll({
                where: { created_user_type, created_by: { [Op.ne]: created_by } },
                include: [
                    {
                        model: CampaignBulkNotificationChannelMapModel
                    },
                    {
                        model: CampaignGroupModel,
                    }
                ],
                order: [['created_at', 'DESC']]
            })
    
            return { NotificationList, myPendingNotificationList, PendingNotificationList }
        }
        else {

            //for unknown...
            return { NotificationList: [], myPendingNotificationList: [], PendingNotificationList: [] }
        }
    }

    emitKafka(notificationInfo) {
        this.logger.log('Messeage Send -> ' + JSON.stringify(notificationInfo));
        return this.client.emit(process.env.KAFKA_FINAL_NOTIFICATION_TOPIC, JSON.stringify(notificationInfo))
    }
    async pendingBulkNotificationWithGroupAction(reqbody, userinfo) {

        let { id, username = null, roleid = 0, subuser_id = 0 } = userinfo, action = 'REJECTED', group_map_createBody = []
        let fb_page_status

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = subuser_id ? `${subuser_id}` : `${id}`

        //action_id = 1=> approve, action_id = 2=> reject, action_id = 3 => delete
        const { action_id = 2, notification_id, reject_msg = null } = reqbody

        action = (action_id == 1) ? 'APPROVED' : (action_id == 2) ? 'REJECTED' : 'DELETE'

        const notificationTemp = await this.bulkNotificationByGroupTempRepo.findOne({ where: { id: notification_id } })

        if (!notificationTemp) {

            throw new NotFoundException()
        }

        if (notificationTemp['dataValues']['created_by'] == created_by && (action_id == 1 || action_id == 2)) {

            throw new BadRequestException('You cannot Approve/Reject it')
        }

        const { group_id, channel_map_id, created_by_name, isScheduled, effective_date, expiry_date, qouta_id, sms_from, push_from, status, is_rule_base_notification, repeat_type, repeat_time, repeat_start_date, repeat_day, repeat_month_day, rule_id,
            isRepeat, created_by: old_created_by = null, created_by_name: old_created_by_name = null, created_user_type: old_created_user_type = null, idx, action: old_action, fb_page_post_category_ids, facebookpage_subcategory_ids, is_Ad, isAdScheduled } = notificationTemp['dataValues']
        // const delay = secondDiffBetweenTwoDateTimes(notificationTemp['dataValues']['effective_date']) * 1000
        // console.log('delay ', delay)

        const groupCreateBody = {
           
            group_id,
            isScheduled,
            effective_date,
            expiry_date,
            qouta_id,
            repeat_type,
            sms_from,
            push_from,
            status,
            repeat_start_date,
            repeat_day,
            is_rule_base_notification,
            repeat_month_day,
            isRepeat,
            repeat_time,
            rule_id,
            channel_map_id,
            created_by: notificationTemp.created_by,
            created_by_name: notificationTemp.created_by_name,
            created_user_type: notificationTemp.created_user_type,
            idx,
            action,
            approved_by: username,
            approved_at: Sequelize.literal("(now() at time zone 'utc')"),
            fb_page_post_category_ids,
            facebookpage_subcategory_ids,
            //facebook_notification_status: JSON.stringify(fb_page_status)
            is_Ad,
            isAdScheduled

        }

        if (action_id == 1) {
            let notificationFinal
            
            const bulkgroup = isScheduled == true ? notificationFinal = await this.bulkNotificationByGroupRepo.create({ ...groupCreateBody, status: 1 }) : notificationFinal = await this.bulkNotificationByGroupRepo.create(groupCreateBody)
            
            //this.emitKafkaPushNotif(bulkgroup)
            //let finalTable = [], i=0
            //let groupMembers = await this.groupBase.findAll({ where: { group_id } })
            //let notificationChannel = await this.bulkNotificationChannelMapRepo.findOne({ where: { id: channel_map_id } })
            
            //const notificationInfo = await this.bulkNotificationByGroupRepo.create(groupCreateBody)
            this.bulkNotificationChannelMapRepo.findOne({ where: { id: channel_map_id } })
            this.bulkNotificationByGroupTempRepo.destroy({ where: { id: notification_id } })
            this.bulkNotificationByGroupHistoryRepo.create(groupCreateBody)

            this.emitKafka(notificationFinal)

            
            
            
            //let configs = await this.campaignConfig.findOne({ where: { created_user_type: 1, created_by: "meena" } })
            

           
            const requestBody = {
                "notification_id": notificationFinal.id,
                "username": notificationFinal.username,
                "created_user_type": notificationFinal.created_user_type,
                "created_by": notificationFinal.created_by

            }
                

            const header = {
                'Module': process.env.FB_MODULE
            }

            try {
                const response = await axios.post(`${process.env.FB_PAGE_POST}/fbpost/post/fb_page_post`, requestBody, { headers: header });
          
                // Log the response to the console
                console.log('Response:', response.status);
          
                // Do something with the response
                fb_page_status = response.status

                 this.bulkNotificationByGroupRepo.update({ facebook_notification_status: fb_page_status }, { where: { id: notificationFinal.id } } )
                //return response.data; // Return the response data or handle it accordingly
            } catch (error) {
                // Handle error if the POST request fails
                console.error('Error:', error.message);
                throw new Error(error.message);
            }
            
           
             
            
            
            // let repeatDate
            // if (repeat_type == 'Daily') {
            //     let hours = repeat_time.charAt(0) + repeat_time.charAt(1)
            //     let minutes = repeat_time.charAt(3) + repeat_time.charAt(4)
            //     let repeatStart_year = moment(repeat_start_date).get('year')
            //     let repeatStart_month = moment(repeat_start_date).get('month')
            //     let repeatStart_date = moment(repeat_start_date).get('date')
            //     let repeatStart_hour = moment(repeat_start_date).get('hour')
            //     let repeatStart_minute = moment(repeat_start_date).get('minute')
            //     let repeatStart_second = moment(repeat_start_date).get('second')
            //     let repeatTimeHour = Number(repeat_time.charAt(0) + repeat_time.charAt(1))
            //     let repeatTimeMinute= Number(repeat_time.charAt(3)+repeat_time.charAt(4))
            //     let repeatHourDuration = repeatTimeHour - repeatStart_hour 
            //     let repeatMinuteDuration=repeatTimeMinute-repeatStart_minute
            //     repeatDate = moment(repeat_start_date).add(1, 'days').add(repeatHourDuration, 'hours').add(repeatMinuteDuration, 'minutes')
                
            // }
            //     // repeatDate = repeatStart.setHours(Number(hours), Number(minutes))
                
            //     //return new Date(repeatStart.toString())
                
            

            // if (repeat_type == 'Weekly') {
            //     let hours = repeat_time.charAt(0) + repeat_time.charAt(1)
            //     let minutes = repeat_time.charAt(3) + repeat_time.charAt(4)
            //     let repeatStart_year = moment(repeat_start_date).get('year')
            //     let repeatStart_month = moment(repeat_start_date).get('month')
            //     let repeatStart_date = moment(repeat_start_date).get('date')
            //     let repeatStart_hour = moment(repeat_start_date).get('hour')
            //     let repeatStart_minute = moment(repeat_start_date).get('minute')
            //     let repeatStart_second=moment(repeat_start_date).get('second')
            //     // repeatDate = repeatStart.setHours(Number(hours), Number(minutes))
                
            //     //return new Date(repeatStart.toString())
                
            // }

            // if (repeat_type == 'Monthly') {
            //     let hours = repeat_time.charAt(0) + repeat_time.charAt(1)
            //     let minutes = repeat_time.charAt(3) + repeat_time.charAt(4)
            //     let repeatStart_year = moment(repeat_start_date).get('year')
            //     let repeatStart_month = moment(repeat_start_date).get('month')
            //     let repeatStart_date = moment(repeat_start_date).get('date')
            //     let repeatStart_hour = moment(repeat_start_date).get('hour')
            //     let repeatStart_minute = moment(repeat_start_date).get('minute')
            //     let repeatStart_second=moment(repeat_start_date).get('second')
            //     // repeatDate = repeatStart.setHours(Number(hours), Number(minutes))
                
            //     //return new Date(repeatStart.toString())
                
            // }

            //mokbul comment..
        //   let saveInFinalTableForSms=async (group)=> {
        //         for (let member of group) {
        //             let finalTableObj = {
        //                         sender_id:sms_from,
        //                         receiver_id: member.msisdn,
        //                         channel: 'sms',
        //                         title: null,
        //                         body: notificationChannel.sms_body,
        //                         attachment: null,
        //                         status: 0,
        //                         quota_id: groupCreateBody.qouta_id,
        //                         created_by: groupCreateBody.created_by,
        //                         created_user_type: groupCreateBody.created_user_type,
        //                         created_at: Sequelize.literal("(now() at time zone 'utc')"),
        //                         sent_at: null,
        //                         is_schedule: isScheduled,
        //                         schedule_date:effective_date,
        //                         is_repeat: groupCreateBody.isRepeat,
        //                         repeat_start_date:repeat_start_date,
        //                         next_repeat_date: repeat_start_date,
        //                         repeat_expire_date:expiry_date,
        //                         campaign_rule_id: groupCreateBody.rule_id,
        //                         ad_rule_id:null,
        //                         notification_id:bulkgroup.id
                                
        //                     }
        
        //                     finalTable.push(finalTableObj)
        //                 }
        //                 const createFinalTable = await this.notificationFinalRepo.bulkCreate(finalTable)
        //                 finalTable=[]
        //         }
            

        //     let saveInFinalTableForEmail=async (group)=> {
        //         for (let member of group) {
        //             let finalTableObj = {
        //                 receiver_id: member.email,
        //                 channel: 'email',
        //                 title: notificationChannel.email_title,
        //                 body: notificationChannel.email_body,
        //                 attachment: notificationChannel.email_attachment,
        //                 status: 0,
        //                 quota_id: groupCreateBody.qouta_id,
        //                 created_by: groupCreateBody.created_by,
        //                 created_user_type: groupCreateBody.created_user_type,
        //                 created_at: Sequelize.literal("(now() at time zone 'utc')"),
        //                 sent_at: null,
        //                 is_repeat: groupCreateBody.isRepeat,
        //                 next_repeat_date: repeat_start_date,
        //                 is_schedule: isScheduled,
        //                 schedule_date: effective_date,
        //                 repeat_start_date: repeat_start_date,
        //                 repeat_expire_date:expiry_date,
        //                 campaign_rule_id: groupCreateBody.rule_id,
        //                 ad_rule_id:null,
        //                 notification_id:bulkgroup.id
                        
        //             }
        
        //                     finalTable.push(finalTableObj)
        //                 }
        //                 const createFinalTable = await this.notificationFinalRepo.bulkCreate(finalTable)
        //                 finalTable=[]
        //         }
            

        //     let saveInFinalTableForPushNotification=async (group)=> {
        //         for (let member of group) {
        //             let finalTableObj = {
        //                 sender_id:push_from,
        //                 receiver_id: member.device_id,
        //                 channel: 'push_notification',
        //                 title: notificationChannel.push_notification_title,
        //                 body: notificationChannel.push_notification_body,
        //                 attachment: notificationChannel.push_notification_image,
        //                 status: 0,
        //                 quota_id: groupCreateBody.qouta_id,
        //                 created_by: groupCreateBody.created_by,
        //                 created_user_type: groupCreateBody.created_user_type,
        //                 created_at: Sequelize.literal("(now() at time zone 'utc')"),
        //                 sent_at: null,
        //                 is_repeat: groupCreateBody.isRepeat,
        //                 is_schedule: isScheduled,
        //                 schedule_date: effective_date,
        //                 repeat_start_date:repeat_start_date,
        //                 next_repeat_date: repeat_start_date,
        //                 repeat_expire_date:expiry_date,
        //                 campaign_rule_id: groupCreateBody.rule_id,
        //                 ad_rule_id:null,
        //                 notification_id:bulkgroup.id
                        
        //             }
        
        //                     finalTable.push(finalTableObj)
        //                 }
        //                 const createFinalTable = await this.notificationFinalRepo.bulkCreate(finalTable)
        //                 finalTable=[]
        //         }
            

        //     if (is_rule_base_notification == false) {
        //         if (notificationChannel.sms == true) {
        //             await saveInFinalTableForSms(groupMembers)
    
        //          }
    
        //         if (notificationChannel.email == true) {
        //             await saveInFinalTableForEmail(groupMembers)
    
        //         }
    
        //         if (notificationChannel.push_notification == true) {
        //           await saveInFinalTableForPushNotification(groupMembers)
        //             }
        //         this.bulkNotificationByGroupTempRepo.destroy({ where: { id: notification_id } })
        //     }

             
        //     if (is_rule_base_notification == true) {
        //         const bonusCampaignGroup = await this.bonusServiceCampaign.findOne({ where: { id:rule_id } })
        //         //return Number(bonusCampaignGroup.map_group_id)
        //         if (Number(bonusCampaignGroup.group_id) == 0 && Number(bonusCampaignGroup.map_group_id) !== 0) {
                     
        //             let mapGroupMembers = await this.groupBase.findAll({ where: { group_id:bonusCampaignGroup.map_group_id } })
        //             if (notificationChannel.sms == true) {
        //                 await saveInFinalTableForSms(mapGroupMembers)
        
        //              }
        
        //             if (notificationChannel.email == true) {
        //                 await saveInFinalTableForEmail(mapGroupMembers)
        
        //             }
        
        //             if (notificationChannel.push_notification == true) {
        //              await saveInFinalTableForPushNotification(mapGroupMembers)
        //                 }
        //             this.bulkNotificationByGroupTempRepo.destroy({ where: { id: notification_id } })
                    
        //          }

        //         if (Number(bonusCampaignGroup.group_id) == Number(bonusCampaignGroup.map_group_id)) {
        //             let mapGroupMembers = await this.groupBase.findAll({ where: { group_id:bonusCampaignGroup.map_group_id } })
        //             if (notificationChannel.sms == true) {
        //                 await saveInFinalTableForSms(mapGroupMembers)
        
        //              }
        
        //             if (notificationChannel.email == true) {
        //                 await saveInFinalTableForEmail(mapGroupMembers)
        
        //             }
        
        //             if (notificationChannel.push_notification == true) {
        //              await saveInFinalTableForPushNotification(mapGroupMembers)
        //                 }
        //             this.bulkNotificationByGroupTempRepo.destroy({ where: { id: notification_id } })
                    
        //          }

        //         if (Number(bonusCampaignGroup.group_id) !== 0 && Number(bonusCampaignGroup.map_group_id) !== 0 && Number(bonusCampaignGroup.group_id)!==Number(bonusCampaignGroup.map_group_id)) {
        //             let mapGroupMembers = await this.groupBase.findAll({ where: { group_id: bonusCampaignGroup.map_group_id } })
        //             let onlyGroupMembers=await this.groupBase.findAll({ where: { group_id: bonusCampaignGroup.group_id } })
        //             if (notificationChannel.sms == true) {
        //                 await saveInFinalTableForSms(mapGroupMembers)
        //                 await saveInFinalTableForSms(onlyGroupMembers)
        
        //              }
        
        //             if (notificationChannel.email == true) {
        //                 await saveInFinalTableForEmail(mapGroupMembers)
        //                 await saveInFinalTableForEmail(onlyGroupMembers)
        
        //             }
        
        //             if (notificationChannel.push_notification == true) {
        //                 saveInFinalTableForPushNotification(mapGroupMembers)
        //                 saveInFinalTableForPushNotification(onlyGroupMembers)
        //                 }
        //             this.bulkNotificationByGroupTempRepo.destroy({ where: { id: notification_id } })
                    
        //         }
                
        //     }
        }
        else {
           
            this.bulkNotificationByGroupHistoryRepo.create(groupCreateBody)
            this.bulkNotificationByGroupTempRepo.destroy({ where: { id: notification_id } })
            this.bulkNotificationChannelMapRepo.destroy({where:{id:channel_map_id}})
            
            
        }

        return {
            status:true,
            fb_page_status: fb_page_status
        }

        //success..
        
    }

    async bulkNotificationListWithoutGroup(userinfo) {

        let { id, username = null, roleid = 0, mobile = null, idx = 0, subuser_id = 0 } = userinfo

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = subuser_id ? `${subuser_id}` : `${id}`, created_by_name = username ? username : mobile

        idx = (created_user_type == 2 && idx) ? idx : -1

        //for merchent / merchent user..
        if (created_user_type == 2) {

            const NotificationList = await this.bulkNotificationWithoutGroupRepo.findAll({ where: { idx } })

            const myPendingNotificationList = await this.bulkNotificationWithoutGroupTempRepo.findAll({ where: { idx, created_by } })
    
            const PendingNotificationList = await this.bulkNotificationWithoutGroupTempRepo.findAll({ where: { idx, created_by: { [Op.ne]: created_by } } })
    
            return { NotificationList, myPendingNotificationList, PendingNotificationList }
        }

        else if (created_user_type == 1) {

            //for admin/ admin user..
            const NotificationList = await this.bulkNotificationWithoutGroupRepo.findAll({ where: { created_user_type } })

            const myPendingNotificationList = await this.bulkNotificationWithoutGroupTempRepo.findAll({ where: { created_by, created_user_type } })
    
            const PendingNotificationList = await this.bulkNotificationWithoutGroupTempRepo.findAll({ where: { created_user_type, created_by: { [Op.ne]: created_by } } })
    
            return { NotificationList, myPendingNotificationList, PendingNotificationList }
        }
        else {

            //for unknown...
            return { NotificationList: [], myPendingNotificationList: [], PendingNotificationList: [] }
        }
    }
    async createBulkNotificationWithoutGroupByPms(reqbody) {

        const createData = reqbody.map(item => {

            return {
                title: item.title,
                body: item.body,
                msisdn: item.msisdn,
                created_by: item.created_by,
                created_user_type: item['created_user_type'] || 1,
                idx: item['idx'] || 0,
                channel_map_id: 1
            }
        })
        
        return await this.bulkNotificationWithoutGroupRepo.bulkCreate(createData)
    }


    async action(data) {

        if (data['action'] == 'APPROVED') {

            // const updatedDataIds = []
            // const updatedDataTroubleShooting = []
            // let lemail_config_type 
            // let email_host 
            // let email_service 
            // let email_port 
            // let email_password 
            // let email_address 
            // let result_email_address = []
            // let result_sms_number = []
            // const result = await this.bulkNotificationChannelMapRepo.findOne({ where: { id: data['channel_map_id'] }, raw: true })
            // const notificationInfo = await this.bulkNotificationByGroupTempRepo.findOne({ where: { id: data['notification_id'] } })
            // const created_user_type = notificationInfo.created_user_type
            // if (created_user_type == 2) {
            //     const campaign_config=await this.campaignConfig.findOne({where:{}})
            // }
           
            // if(result['email']=== true){
            //     result_email_address = await this.groupBase.findAll({attributes:['email'],where:{group_id: data['group_id']},raw:true})
            
            // if(result_email_address.length !== 0){
            //     for(let item of result_email_address){

            //         let email_data={
            //             to: item.email,
            //             from: email_address,
            //             subject:data['title'],
            //             text: data['body'],
            //         }
            //         console.log('printed');
                    
            //         await this.mailerService.send_email(email_data)
            //     }
            // }}
            // if(result['sms']=== true){
            //     result_sms_number = await this.groupBase.findAll({attributes:['msisdn'],where:{group_id: data['group_id']},raw:true})

            //     if(result_sms_number.length !== 0){
            //         for(let item of result_sms_number){

            //             let sms_data = {
            //                 msisdn: item.msisdn,
            //                 text: data['body']
            //             }

            //             await this.smsService.send_sms(sms_data)
            //         }
            // }}
            await this.bulkNotificationByGroupRepo.create(data)
            this.bulkNotificationByGroupHistoryRepo.create(data)
            this.bulkNotificationByGroupTempRepo.destroy({ where : { id : data['notification_id']}})
            
   

     
        
        }


    }
}