import { Injectable, Inject, BadRequestException, UnprocessableEntityException, NotFoundException } from '@nestjs/common';
import {SmsRateModel, GlobalCommissionModel, MerchantCommissionModel} from '../../models'
import {SMs_RATE, GLOBAL_COMMISSION, MERCHANT_COMMISSION} from '../../config/constants'
import { Sequelize} from 'sequelize-typescript';
import { Op } from 'sequelize';


import {winstonLog} from '../../config/winstonLog'


@Injectable()
export class CostmanagementService {

    constructor(
        @Inject(SMs_RATE) private readonly smsRate: typeof SmsRateModel,
        @Inject(GLOBAL_COMMISSION) private readonly globalCommission: typeof GlobalCommissionModel,
        @Inject(MERCHANT_COMMISSION) private readonly merchantCommission: typeof MerchantCommissionModel
      
    ) { }

    async getSmsRate(reqbody, userinfo) {

        const sms_rate = await this.smsRate.findOne({ attributes: ['per_sms_cost', 'id']})

        return sms_rate
    }

    async createSmsRate(reqbody, userinfo) {

        const { username = null } = userinfo
        const {per_sms_cost}=reqbody
        const create_sms_rate = await this.smsRate.create({
            per_sms_cost, created_by:username
        })
 
         return create_sms_rate
    }
    
    async editSmsRate(reqbody, userinfo) {

        const { username=null } = userinfo
        const {id, per_sms_cost}=reqbody
        const create_sms_rate = await this.smsRate.update({
            per_sms_cost},{where:{id}})
 
        return 'updated'
    }
    
    async getGlobalCommission(reqbody, userinfo) {

        const global_commission = await this.globalCommission.findOne({})

        return global_commission
    }

    async editGlobalCommission(reqbody, userinfo) {
        const { username=null } = userinfo
        const { id, commission_percentage } = reqbody
        const existing_global_commission = await this.globalCommission.findOne({ where: { id } })
        if (existing_global_commission) {
            const update_global_commission = await this.globalCommission.update({
                commission_percentage},{where:{id}})
        } else {
            const create_global_commission = await this.globalCommission.create({
                commission_percentage, created_by:username})
     
        }
       
 
        return 'updated'
    }

    async createGlobalCommissionRate(reqbody, userinfo) {
        const { username=null } = userinfo
        const { commission_percentage } = reqbody
        const existing_global_commission = await this.globalCommission.findOne({})
        if (existing_global_commission) {
            await this.globalCommission.destroy({where:{id:existing_global_commission.id}})
        const create_global_commission = await this.globalCommission.create({
            commission_percentage, created_by:username})
 
        return create_global_commission
        } else {
            const create_global_commission = await this.globalCommission.create({
                commission_percentage, created_by:username})
     
            return create_global_commission
        }
        
    }

    async createMerchantCommissionRate(reqbody, userinfo) {
        const { username=null } = userinfo
        const { commission_percentage, merchant_id, merchant_name } = reqbody
        
        return await this.merchantCommission.create({commission_percentage,merchant_id,merchant_name, created_by:username  })
       
        
    }

    async editMerchantCommissionRate(reqbody, userinfo) {
        const {id, commission_percentage, merchant_id, merchant_name}=reqbody
        const update_global_commission = await this.merchantCommission.update({
            commission_percentage, merchant_id, merchant_name},{where:{id}})
 
        return 'updated'
    }

    async deleteMerchantCommissionRate(reqbody, userinfo) {
        const {id}=reqbody
        const delete_global_commission = await this.merchantCommission.destroy({where:{id}})
 
        return 'Deleted'
    }

    async getMerchantCommissionRate(limit: number, offset: number,reqbody, userinfo) {
        const {id}=reqbody
        return await this.merchantCommission.findAndCountAll({
            limit,
            offset,
        })
 
        
    }

    
}