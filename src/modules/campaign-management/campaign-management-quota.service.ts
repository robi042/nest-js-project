import { Injectable, Inject, BadRequestException, UnprocessableEntityException, NotFoundException } from '@nestjs/common';
import {CampaignQuotaModel, CampaignQuotaHistoryModel, CustomerWalletModel, CustomerWalletHistoryModel, CustomerWalletTempModel,CustomerProfileModel, GlobalCommissionModel, MerchantCommissionModel} from '../../models'
import {CAMPAIGN_QUOTA_REPOSITORY, CAMPAIGN_QUOTA_HISTORY_REPOSITORY, CUSTOMER_WALLET, CUSTOMER_WALLET_HISTORY, CUSTOMER_WALLET_TEMP,CUSTOMER_PROFILE, GLOBAL_COMMISSION, MERCHANT_COMMISSION} from '../../config/constants'
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';


import {winstonLog} from '../../config/winstonLog'


@Injectable()
export class CampaignManagementQuotaService {

    constructor(
        @Inject(CAMPAIGN_QUOTA_REPOSITORY) private readonly campaignQuota: typeof CampaignQuotaModel,
        @Inject(CAMPAIGN_QUOTA_HISTORY_REPOSITORY) private readonly campaignQuotaHistory: typeof CampaignQuotaHistoryModel,
        @Inject(CUSTOMER_WALLET) private readonly customerWallet: typeof CustomerWalletModel,
        @Inject(CUSTOMER_WALLET_HISTORY) private readonly customerWalletHistory: typeof CustomerWalletHistoryModel,
        @Inject(CUSTOMER_WALLET_TEMP) private readonly customerWalletTemp: typeof CustomerWalletTempModel,
        @Inject(CUSTOMER_PROFILE) private readonly customerProfile: typeof CustomerProfileModel,
        @Inject(GLOBAL_COMMISSION) private readonly globalCommission: typeof GlobalCommissionModel,
        @Inject(MERCHANT_COMMISSION) private readonly merchantCommission: typeof MerchantCommissionModel,
    
      
    ) { }

    async createCampaignQuota(reqbody, userinfo) {

        let {id, username = null, roleid = 0, mobile=null, idx = 0} = userinfo

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`, created_by_name = username ? username : mobile

        const {title, total_budget,facebook = 0, google = 0, whatsapp = 0, sms = 0, email = 0, push_notification = 0, instagram = 0 , twitter = 0} = reqbody

        const createBody = {
            title,
            total_budget,
            facebook,
            google,
            whatsapp,
            sms,
            email,
            push_notification,
            instagram,
            twitter,
            created_by,
            created_by_name,
            created_user_type,
            action : "INSERT",
            action_by : created_by,
            action_by_name : created_by_name,
            action_by_user_type : created_user_type,
            idx
        }

        this.campaignQuotaHistory.create(createBody)

        return await this.campaignQuota.create(createBody)
    }

    //by admin/admin user..
    async getAllCampaignQuotaList(userinfo) {

        let {id, username = null, roleid = 0, idx = 0} = userinfo

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`

        idx = (created_user_type == 2 && idx) ? idx  : (created_user_type == 1) ? 0 : -1

        if(created_user_type == 1) {

            return this.campaignQuota.findAll<CampaignQuotaModel>({ order : [['id','DESC']] })

        }
        else {

            return this.campaignQuota.findAll<CampaignQuotaModel>({ where : { created_by, created_user_type, idx}, order :[['id','DESC']]})

        }
    }

    //approve, reject, delete..
    async campaignQuotaAction(reqbody,userinfo){
        
        let {id, username = null, roleid = 0} = userinfo, action = 'REJECTED'

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`

        //action_id = 1=> approve, action_id = 2=> reject, action_id = 3 => delete
        const {action_id = 2, quota_id, reject_msg = null} = reqbody

        action = (action_id == 1) ? 'APPROVED' : (action_id == 2) ? 'REJECTED' : 'DELETE'

        const quotainfo = await this.campaignQuota.findOne({ where : { id : quota_id} })

        if(!quotainfo) {

            throw new NotFoundException()
        }

        if(quotainfo['dataValues']['created_by'] == created_by && (action_id == 1 || action_id == 2)) {

            throw new BadRequestException('You cannot Approve/Reject it')
        }

        const {title, total_budget,facebook = 0, google = 0, whatsapp = 0, sms = 0, email = 0, push_notification = 0, instagram = 0, twitter = 0, created_by_name, created_by : old_created_by = null, created_by_name: old_created_by_name = null, created_user_type : old_created_user_type = null, idx } = quotainfo['dataValues']

        const createBody = {
            title,
            total_budget,
            facebook,
            google,
            whatsapp,
            sms,
            email,
            push_notification,
            instagram,
            twitter,
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

        this.campaignQuotaHistory.create(createBody)

        if(action_id == 1) {

            this.campaignQuota.update({ is_approved : true, is_rejected : false, approved_by : username, approved_at : Sequelize.literal("(now() at time zone 'utc')")},{ where : { id : quota_id}})
        }
        else if(action_id == 2) {

            this.campaignQuota.update({ is_rejected : true, is_approved: false, reject_msg, approved_by : username,approved_at : Sequelize.literal("(now() at time zone 'utc')")},{ where : { id : quota_id}})
        }
        else {

            this.campaignQuota.destroy({ where : { id : quota_id}})
        }

        return true

    }

    async createCampaignBudget(reqbody, userinfo) {

        let {id, username = null, roleid = 0, mobile=null, idx = 0} = userinfo

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`, created_by_name = username ? username : mobile

        const {proposed_budget} = reqbody

        const createBody = {
            proposed_budget,
            created_by,
            created_by_name,
            created_user_type,
            action : "INSERT",
            action_by : created_by,
            action_by_name : created_by_name,
            action_by_user_type : created_user_type,
            idx
        }

        await this.customerWalletTemp.create( createBody,{ logging:console.log })

        return await this.customerWalletHistory.create( createBody, { logging:console.log } )
    }

    async getAllCampaignBudgetList(userinfo) {

        let {id, username = null, roleid = 0, idx = 0} = userinfo

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`

        idx = (created_user_type == 2 && idx) ? idx  : (created_user_type == 1) ? 0 : -1

        if(created_user_type == 1) {

            return this.customerWallet.findAll<CustomerWalletModel>({ order : [['id','DESC']] })

        }
        else {

            return this.customerWallet.findAll<CustomerWalletModel>({ where : { created_by, created_user_type, idx}, order :[['id','DESC']]})

        }
    }

    async getAllCampaignBudgePendingtList(userinfo) {

        let {id, username = null, roleid = 0, idx = 0} = userinfo

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`

        idx = (created_user_type == 2 && idx) ? idx  : (created_user_type == 1) ? 0 : -1

        if(created_user_type == 1) {

            return this.customerWalletTemp.findAll<CustomerWalletTempModel>({ order : [['id','DESC']] })

        }
        else {

            return this.customerWalletTemp.findAll<CustomerWalletTempModel>({ where : { created_by, created_user_type, idx}, order :[['id','DESC']]})

        }
    }

    async campaignBudgetAction(reqbody,userinfo){
        
        let {id, username = null, roleid = 0} = userinfo, action = 'REJECTED'

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`

        //action_id = 1=> approve, action_id = 2=> reject, action_id = 3 => delete
        const {action_id = 2, budget_id, reject_msg = null} = reqbody

        action = (action_id == 1) ? 'APPROVED' : (action_id == 2) ? 'REJECTED' : 'DELETE'

       

        if (action_id == 1) {
            const budgetInfo = await this.customerWalletTemp.findOne({ where: { id: budget_id } })
        

            if(!budgetInfo) {
    
                throw new NotFoundException()
            }
    
            if(budgetInfo['dataValues']['created_by'] == created_by && (action_id == 1 || action_id == 2)) {
    
                throw new BadRequestException('You cannot Approve/Reject it')
            }
    
            const {proposed_budget=0, created_by_name, created_by : old_created_by = null, created_by_name: old_created_by_name = null, created_user_type : old_created_user_type = null, idx } = budgetInfo['dataValues']
    
            const createBody = {
                proposed_budget,
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
    
            this.customerWalletHistory.create(createBody)
            if (budgetInfo['dataValues'].action == 'DELETE') {

                
                const saved_id = budgetInfo.update_id
                console.log(saved_id);
                
              if(!budgetInfo) {
      
                  throw new NotFoundException()
              }
      
          
              if( budgetInfo['dataValues']['created_by'] == created_by && (action_id == 1 || action_id == 2)) {
      
                throw new BadRequestException('You cannot Approve/Reject it')
            }
                console.log(budgetInfo);
              
                this.customerWallet.destroy({ where: { id: budgetInfo['dataValues']['update_id'] } })
                this.customerWalletTemp.destroy({ where: { id: budget_id } })
               
                return true
            } else {
                const merchant_commission = await this.merchantCommission.findOne({ where: { merchant_id: { [Op.contains]: [budgetInfo['dataValues']['action_by']] } } })
                if (merchant_commission) {
                    const admin_commission_percentage = merchant_commission.commission_percentage
                    const admin_commission_balance=(proposed_budget * admin_commission_percentage) / 100
                    const balance_after_Commission =(proposed_budget- ((proposed_budget * admin_commission_percentage) / 100))
                     this.customerWallet.create({ ...createBody, is_approved:true, approved_by:username ,current_balance: balance_after_Commission, admin_commission: admin_commission_balance })
                     this.customerWalletHistory.create({ ...proposed_budget, is_approved:true, approved_by:username ,current_balance: balance_after_Commission, admin_commission: admin_commission_balance })
                     const customer = await this.customerProfile.findOne({ where: { idx } })
                    if (customer) {
                        this.customerProfile.update({ customer_balance: balance_after_Commission }, { where: { id: old_created_by } })
                    }
    
                    this.customerWalletTemp.destroy({where:{id:budget_id}})
                    
                    return true
                } else {
                     const admin_commission_db = await this.globalCommission.findOne()
                    const admin_commission_percentage = admin_commission_db.commission_percentage
                    const admin_commission_balance=(proposed_budget * admin_commission_percentage) / 100
                     const balance_after_Commission =(proposed_budget- ((proposed_budget * admin_commission_percentage) / 100))
                     this.customerWallet.create({ ...createBody, is_approved:true, approved_by:username ,current_balance: balance_after_Commission, admin_commission: admin_commission_balance })
                     this.customerWalletHistory.create({ ...proposed_budget, is_approved:true, approved_by:username ,current_balance: balance_after_Commission, admin_commission: admin_commission_balance })
                     const customer = await this.customerProfile.findOne({ where: { idx } })
                    if (customer) {
                        this.customerProfile.update({ customer_balance: balance_after_Commission }, { where: { id: old_created_by } })
                    }
    
                    this.customerWalletTemp.destroy({where:{id:budget_id}})
                    
                    return true
                }
                
               }
            
           
        }
        else if (action_id == 2) {
            const budgetInfo = await this.customerWalletTemp.findOne({ where: { id: budget_id } })
        

            if(!budgetInfo) {
    
                throw new NotFoundException()
            }
    
            if(budgetInfo['dataValues']['created_by'] == created_by && (action_id == 1 || action_id == 2)) {
    
                throw new BadRequestException('You cannot Approve/Reject it')
            }

            if (budgetInfo['dataValues'].action == 'DELETE') {

                const saved_id = budgetInfo.update_id
                console.log(saved_id);
                
              if(!budgetInfo) {
      
                  throw new NotFoundException()
              }
      
          
              if( budgetInfo['dataValues']['created_by'] == created_by && (action_id == 1 || action_id == 2)) {
      
                throw new BadRequestException('You cannot Approve/Reject it')
            }
                console.log(budgetInfo);
              
                this.customerWallet.update({ is_approved: true, is_rejected: true, approved_by: null, approved_at: null, action: 'APPROVED' }, { where: { id: saved_id } })
               
                this.customerWalletTemp.destroy({ where: { id: budget_id } })
                
      
      
              return true
            
            }

            if (budgetInfo['dataValues'].action == 'INSERT') {

                
              if(!budgetInfo) {
      
                  throw new NotFoundException()
              }
      
          
              if( budgetInfo['dataValues']['created_by'] == created_by && (action_id == 1 || action_id == 2)) {
      
                throw new BadRequestException('You cannot Approve/Reject it')
            }
                console.log(budgetInfo);
              
               
                this.customerWalletTemp.destroy({ where: { id: budget_id } })
                
      
      
              return true
            
            }
            
        }
            
        else {
            const approvedBudget = await this.customerWallet.findOne({ where: { id: budget_id } })
            
            const {proposed_budget=0, created_by_name, created_by : old_created_by = null, created_by_name: old_created_by_name = null, created_user_type : old_created_user_type = null, idx } = approvedBudget['dataValues']

            const createBody = {
                proposed_budget,
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

            this.customerWalletHistory.create(createBody)

            this.customerWallet.update({ is_approved: false, is_rejected: false, approved_by: null, approved_at: null, action: 'DELETE' }, { where: { id: budget_id } })
            
            this.customerWalletTemp.create({...createBody, is_approved: false, is_rejected: false, update_id:approvedBudget.id ,approved_by: null, approved_at: null, action: 'DELETE'})

            return true
        }

        return true

    }
}