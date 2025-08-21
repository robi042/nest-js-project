import { Body, Controller, Post } from '@nestjs/common';
import { SingleNotificationService } from './single-notification.service';

@Controller('single-notification')
export class SingleNotificationController {

  constructor(
    private singleNotificationService:SingleNotificationService
  ) {}

  @Post('/')
  async sendNotification(@Body() reqbody){

    return await this.singleNotificationService.sendNotification(reqbody)
  }

  @Post('/merchant')
  async sendNotificationMerchant(@Body() reqbody){

    return await this.singleNotificationService.sendNotificationMerchant(reqbody)
  }
  
  
}
