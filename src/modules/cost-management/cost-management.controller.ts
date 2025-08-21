import { Controller, Post, Request, Body, UseGuards, Get } from '@nestjs/common';
import {CostmanagementService} from './cost-management.service'
import {JwtAuthGuard} from '../../middleware/guards'
import {ComplainDto} from '../../dto'

@Controller('cost-management')
@UseGuards(JwtAuthGuard)

export class CostmanagementController {

    constructor(
        private costManagementService: CostmanagementService
    ) { }

    //for quota managment...start
    @Get('/get_sms_rate')
    async getsmsRate(@Request() req, @Body() reqbody: any) {

        return this.costManagementService.getSmsRate(reqbody, req.user);

    }

    @Post('/creaete_sms_rate')
    async createSmsRate(@Request() req, @Body() reqbody: any) {

        return this.costManagementService.createSmsRate(reqbody, req.user);

    }

    @Post('/edit_sms_rate')
    async editSmsRate(@Request() req, @Body() reqbody: any) {

        return this.costManagementService.editSmsRate(reqbody, req.user);

    }

    @Post('/create_global_commission_rate')
    async createGlobalCommissionRate(@Request() req, @Body() reqbody: any) {

        return this.costManagementService.createGlobalCommissionRate(reqbody, req.user);

    }

    @Get('/get_global_commission_rate')
    async getGlobalCommissionRate(@Request() req, @Body() reqbody: any) {

        return this.costManagementService.getGlobalCommission(reqbody, req.user);

    }

    @Post('/edit_global_commission_rate')
    async editGlobalCommissionRate(@Request() req, @Body() reqbody: any) {

        return this.costManagementService.editGlobalCommission(reqbody, req.user);

    }

    @Post('/create_merchant_commission_rate')
    async createMerchantCommissionRate(@Request() req, @Body() reqbody: any) {

        return this.costManagementService.createMerchantCommissionRate(reqbody, req.user);

    }

    @Post('/delete_merchant_commission_rate')
    async deleteMerchantCommissionRate(@Request() req, @Body() reqbody: any) {

        return this.costManagementService.deleteMerchantCommissionRate(reqbody, req.user);

    }

    @Post('/get_merchant_commission_rate')
    async getMerchantCommissionRate(@Request() req, @Body() reqbody: any) {
        const { page = 1, limit = 10 } = reqbody
        return this.costManagementService.getMerchantCommissionRate(limit, limit * (page - 1),reqbody, req.user);

    }

   

    

   //for quota managment...end

}
