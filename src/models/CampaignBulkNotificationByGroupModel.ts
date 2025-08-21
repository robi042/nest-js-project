import { Table, Column, Model, Sequelize, DataType, CreatedAt, UpdatedAt , HasOne} from 'sequelize-typescript';
import {CampaignBulkNotificationChannelMapModel, CampaignCusGroupModel, GroupBaseModel,CampaignGroupModel} from '../models'

@Table({ tableName: 'campaign_bulk_notification_by_group' })
export class CampaignBulkNotificationByGroupModel extends Model {
    @Column({
        type: DataType.BIGINT,
        autoIncrement : true,
        primaryKey: true
    })
    id: bigint;

   
    @Column({
        type: DataType.BIGINT
    
    })
    group_id: bigint;
    
    @Column({
        type: DataType.BIGINT
       
    })
    rule_id : bigint;
    
    @Column({
        type: DataType.BIGINT
  
    })
    channel_map_id : bigint;
    
    @Column({
        type: DataType.TEXT

    })
    created_by : string;
    
    @Column({
        type: DataType.TEXT
    })
    created_by_name : string;

    @Column({
        type: DataType.SMALLINT
    })
    created_user_type : number;

    @Column({
        type: DataType.INTEGER
    })
    idx : number;

    @Column({
        type: DataType.TEXT
    })
    approved_by : string;

    @Column({
        type: DataType.DATE
    })
    approved_at : Date;
    
    @Column({
        type: DataType.DATE,
        defaultValue : Sequelize.literal("(now() at time zone 'utc')")
    })
    created_at: Date;
    
    @Column({
        type: DataType.BOOLEAN,
        defaultValue:false
    })
    isScheduled: boolean;
    
    @Column({
        type: DataType.DATE,
        defaultValue : Sequelize.literal("(now() at time zone 'utc')")
    })
    effective_date: Date;
    
    @Column({
        type: DataType.TEXT
    })
    remarks: string;
    
    @Column({
        type: DataType.TEXT
    })
    img: string;
    
    @Column({
        type: DataType.DATE,

    })
    expiry_date: Date;
    
    @Column({
        type: DataType.TEXT
    })
    repeat_type: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue:false
    })
    isRepeat: boolean;

    @Column({
        type: DataType.BIGINT,
    })
    qouta_id: bigint;

    @Column({
        type: DataType.BIGINT,
    })
    adRule_id: bigint;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue:false
    })
    is_rule_base_notification: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue:false
    })
    is_Ad: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue:false
    })
    isAdScheduled: boolean;

    @Column({
        type: DataType.DATE,
       
    })
    startDate: Date;

    @Column({
        type: DataType.DATE,
     
    })
    endDate: Date;

    @Column({
        type: DataType.TEXT,
     
    })
    repeat_time: string;

    @Column({
        type: DataType.DATE,
     
    })
    repeat_start_date: Date;

    @Column({
        type: DataType.TEXT,
     
    })
    repeat_day: string;

    @Column({
        type: DataType.TEXT,
     
    })
    repeat_month_day: string;

    @Column({
        type: DataType.TEXT,
     
    })
    sms_from: string;

    @Column({
        type: DataType.TEXT,
     
    })
    push_from: string;

    @Column({
        type: DataType.INTEGER,
        defaultValue:0
    })
    status: number;

    @Column({
        type: DataType.ARRAY(DataType.INTEGER),
    })
    fb_page_post_category_ids: number [];

    @Column({
        type: DataType.ARRAY(DataType.INTEGER),
    })
    facebookpage_subcategory_ids: number[];
    
    @Column({
        type: DataType.TEXT,
    })
    facebook_notification_status:string;

    

    @HasOne(() => CampaignBulkNotificationChannelMapModel, { sourceKey : 'channel_map_id'  })
    channel_info : CampaignBulkNotificationChannelMapModel

    @HasOne(() => CampaignGroupModel, { sourceKey : 'group_id'  })
    group_info : CampaignGroupModel

}