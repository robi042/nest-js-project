import { Injectable, Inject } from '@nestjs/common';
import { NotificationModel } from '../../models/NotificationModel';
import { Notification_Model} from '../../config/constants';
import { Op } from 'sequelize'
import {NotificationCreateDto} from '../../dto/notification.dto'
import { Sequelize } from 'sequelize-typescript';


@Injectable()
export class NotificationManagmentService {
    constructor(
        @Inject(Notification_Model) private readonly notification: typeof NotificationModel,
      
    ) {
        //  this.notification.removeAttribute('id')
    }

    async getAllNotifications(username: string): Promise<any> {
        return await this.notification.findAll({
            where: { Created_By: username },
        });
    }


    async createNotification(requestbody: any, Created_By: string): Promise<any> {

            await this.notification.create({
            
                ...requestbody,
                Created_By: Created_By,
                Created_Date: Date.now()
    
            })
    
            return true
        
    }


    async deleteNotification(id: bigint): Promise<any> {
        const newValue = await this.notification.findOne({ where: { id }, order:[['id', 'ASC']] });
        if (!newValue) {
            return true
        }

        await this.notification.destroy({ where: { id } })

        return true
    }


    
}


