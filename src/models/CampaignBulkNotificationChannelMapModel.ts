import { Table, Column, Model, Sequelize, DataType, CreatedAt, UpdatedAt, ForeignKey } from 'sequelize-typescript';
import {CampaignBulkNotificationByGroupModel, CampaignBulkNotificationByGroupTempModel} from '../models'


@Table({ tableName: 'campaign_bulk_notification_channel_map' })
export class CampaignBulkNotificationChannelMapModel extends Model {

    @ForeignKey(() => CampaignBulkNotificationByGroupModel ) 
    @ForeignKey(() => CampaignBulkNotificationByGroupTempModel ) 
    @Column({
        type: DataType.BIGINT,
        autoIncrement : true,
        primaryKey: true
    })
    id: bigint;

    @Column({
        type: DataType.BOOLEAN
    })
    fb_page_post : boolean;
    
    @Column({
        type: DataType.BOOLEAN
    })
    sms : boolean;

    @Column({
        type: DataType.BOOLEAN
    })
    push_notification : boolean;
    
    @Column({
        type: DataType.BOOLEAN
    })
    email : boolean;
    
    @Column({
        type: DataType.BOOLEAN
    })
    whatsapp : boolean;
    
    @Column({
        type: DataType.BOOLEAN
    })
    instagram : boolean;
    
    @Column({
        type: DataType.BOOLEAN
    })
    twitter : boolean;
    
    @Column({
        type: DataType.DATE,
        defaultValue : Sequelize.literal("(now() at time zone 'utc')")
    })
    created_at : Date;

    @Column({
        type: DataType.STRING
    })
    fb_page_post_body: string;
    
    @Column({
        type: DataType.STRING
    })
    fb_page_post_image: string;
    
    @Column({
        type: DataType.STRING
    })
    sms_body: string;
    
    @Column({
        type: DataType.STRING
    })
    push_notification_title: string;
    
    @Column({
        type: DataType.STRING
    })
    push_notification_body: string;
    
    @Column({
        type: DataType.STRING
    })
    push_notification_image: string;
    
    @Column({
        type: DataType.STRING
    })
    email_title: string;
    
    @Column({
        type: DataType.STRING
    })
    email_body: string;
    
    @Column({
        type: DataType.STRING
    })
    email_attachment: string;
    
    @Column({
        type: DataType.STRING
    })
    instagram_body: string;
    
    @Column({
        type: DataType.STRING
    })
    instagram_image : string;

}