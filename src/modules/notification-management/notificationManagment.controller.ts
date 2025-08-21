import { Controller, Body, Post, UseGuards, Request, Injectable, UnauthorizedException, NotFoundException, Get } from '@nestjs/common';
import { NotificationManagmentService } from './notificationManagment.service'
import { NotificationCreateDto} from '../../dto/notification.dto'
import { NOT_FOUND } from 'src/helpers/responseHelper';
import {JwtAuthGuard} from '../../middleware/guards'


@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationManagmentController {
    constructor(private notificationManagementService: NotificationManagmentService) { }

    
    @Post('/create_notification')
    async createNotification(@Request() req, @Body() reqbody: any) {
        const created_By = req.user.username
        const response = await this.notificationManagementService.createNotification(reqbody, created_By);
        console.log('sss', response)
        if (response) {
            return { res_message: req.i18n.__('Notification is Created successfully') }
            
        } else {
            throw new NotFoundException(NOT_FOUND(req.i18n.__('Notification create Failed'),req));
            
        }
    }

    @Get('')
    async getAllNotifications(@Request() req) {
        const username = req.user.username
        return await this.notificationManagementService.getAllNotifications(username);
    }
    
    @Post('/delete_notification')
    async deleteNotification(@Request() req, @Body() reqbody: any) {
        const response = await this.notificationManagementService.deleteNotification(reqbody.id);
        if (response) {

            return { res_message: req.i18n.__('notification is deleted') }

        } else {

            return { res_message: req.i18n.__('notification is not deleted') }
        }
    }
}
