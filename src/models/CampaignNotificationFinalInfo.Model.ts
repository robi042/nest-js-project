import { Table, Column, Model, Sequelize, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'campaign_notification_final_info_table' })
export class CampaignNotificationFinalModel extends Model {
    @Column({
        type: DataType.BIGINT,
        autoIncrement : true,
        primaryKey: true
    })
    id: bigint;

    @Column({
        type: DataType.TEXT
        
    })
    sender_id: string
    
    @Column({
        type: DataType.TEXT
        
    })
    receiver_id : string

  
    @Column({
        type: DataType.TEXT,
        
    })
    channel : string

    @Column({
        type: DataType.TEXT,
        
    })
    title : string

    @Column({
        type: DataType.TEXT,
       
    })
    body : string

    @Column({
        type: DataType.TEXT
        
    })
    attachment : string


    @Column({
        type: DataType.SMALLINT
        
    })
    status : number

    @Column({
        type: DataType.BIGINT
        
        
    })
    quota_id: bigint
    
    @Column({
        type: DataType.TEXT,
    
        
    })
    created_by: string
    
    @Column({
        type: DataType.SMALLINT
        
    })
    created_user_type: number
    

    @Column({
        type: DataType.DATE,
        defaultValue : Sequelize.literal("(now() at time zone 'utc')")
    })
    created_at: Date
    
    
    @Column({
        type: DataType.DATE,
       
    })
    sent_at : Date

    @Column({
        type: DataType.BOOLEAN
    })
    is_repeat: boolean
    
    @Column({
        type: DataType.DATE,
       
    })
    next_repeat_date: Date

    @Column({
        type: DataType.BIGINT
    })
    campaign_rule_id : bigint

    @Column({
        type: DataType.BIGINT
    })
    ad_rule_id : bigint

    @Column({
        type: DataType.BIGINT
    })
    notification_id: bigint
    
    @Column({
        type: DataType.BOOLEAN
    })
    is_schedule: boolean

    @Column({
        type: DataType.DATE
    })
    repeat_start_date: Date

    @Column({
        type: DataType.DATE
    })
    repeat_expire_date: Date


    

}