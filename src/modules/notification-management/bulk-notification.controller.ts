import { Controller, Body, Post, UseGuards, Request, Injectable, UnauthorizedException, NotFoundException, Get } from '@nestjs/common';
import { BulkNotificationService } from './bulk-notification.service'
import { BulkNotificationGroupDto, BulkNotificationGroupDetailsDto, BulkNotificationDto} from '../../dto/notification.dto'
import {JwtAuthGuard} from '../../middleware/guards'


@Controller('bulk_notification')
@UseGuards(JwtAuthGuard)
export class BulkNotificationController {
    constructor(private bulkNotificationService: BulkNotificationService) { }


  //bulk notification group managment... start

  //insert in temp table..
   @Post('/create_notification_group')
   async createBulkNotificationGroup(@Request() req, @Body() reqbody: BulkNotificationGroupDto) {

      return await this.bulkNotificationService.createBulkNotificationGroup(reqbody,  req.user);

   }

   //approve group_list, my pending group_list, other pending group_list.. 
   @Get('/notification_group_list')
   async bulkNotificationGroupList(@Request() req) {

    return await this.bulkNotificationService.bulkNotificationGroupList(req.user);

 }

   @Post('/notification_group_details')
    async bulkNotificationGroupDetails(@Request() req, @Body() reqbody: BulkNotificationGroupDetailsDto) {

      return await this.bulkNotificationService.bulkNotificationGroupDetails(reqbody, req.user);

    }

   //approve group_list, my pending group_list, other pending group_list.. for admin, 
   @Post('/notification_group_approve_reject_delete')
   async bulkNotificationGroupAction(@Request() req, @Body() reqbody: any) {

    return await this.bulkNotificationService.bulkNotificationGroupAction(reqbody, req.user);

  }

  //from main table...
  @Post('/notification_group_edit_delete')

  async bulkNotificationGroupActionMain(@Request() req, @Body() reqbody: any) {

    return await this.bulkNotificationService.bulkNotificationGroupActionMain(reqbody, req.user);

  }

/*  @Post('/notification_group_map_add')

  @Post('/notification_group_map_delete')
*/
  //bulk notification group managment... end

  //bulk notification ... start
  
  @Post('/notification_create_with_group')
  async bulkNotificationCreateWithGroup(@Request() req, @Body() reqbody: any) {

    return await this.bulkNotificationService.bulkNotificationCreateWithGroup(reqbody, req.user);

  }

  @Get('/notification_list_with_group')
  async bulkNotificationListWithGroup(@Request() req) {

    return await this.bulkNotificationService.bulkNotificationListWithGroup( req.user);

  }

  @Post('/pending_group_notification_approve_reject_delete')
  async pendingBulkNotificationWithGroupAction(@Request() req, @Body() reqbody: any) {

    return await this.bulkNotificationService.pendingBulkNotificationWithGroupAction(reqbody,req.user);

  }

  @Get('/notification_list_without_group')
  async bulkNotificationListWithoutGroup(@Request() req) {

    return await this.bulkNotificationService.bulkNotificationListWithoutGroup( req.user);

  }
  //bulk notification ... end

  @Post('/createBulkNotificationWithoutGroupByPms')
  async createBulkNotificationWithoutGroupByPms( @Body() reqbody: any) {

    return await this.bulkNotificationService.createBulkNotificationWithoutGroupByPms(reqbody);

  }

}
