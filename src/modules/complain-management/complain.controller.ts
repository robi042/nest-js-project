import { Controller, Post, Request, Body, UseGuards, Get } from '@nestjs/common';
import {ComplainService} from './complain.service'
import {JwtAuthGuard} from '../../middleware/guards'
import {ComplainDto} from '../../dto'

@Controller('complain')
@UseGuards(JwtAuthGuard)

export class ComplainController {

    constructor(
        private complainService: ComplainService
    ) { }

    //for quota managment...start
    @Post('/create_complain')
    async createCampaignQuota(@Request() req, @Body() reqbody: ComplainDto) {

        return this.complainService.createComplain(reqbody, req.user);

    }

    @Get('/complain_list')
    async GetComplainList(@Request() req, @Body() reqbody: any) {

        return this.complainService.getAllComplain(req.user);

    }

    @Post('/edit_complain')
    async editComplain(@Request() req, @Body() reqbody: ComplainDto) {

        return this.complainService.editComplain(reqbody, req.user);

    }

    @Post('/delete_complain')
    async DeleteComplain(@Request() req, @Body() reqbody: any) {

        return this.complainService.deleteComplain(reqbody);

    }

   //for quota managment...end

}
