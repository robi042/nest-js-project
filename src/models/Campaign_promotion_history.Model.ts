import { Table, Column, Model, Sequelize, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'campaign_promotion_history' })
export class CampaignPromotionHistoryModel extends Model {
    @Column({
        type: DataType.BIGINT,
        autoIncrement : true,
        primaryKey: true
    })
    id: bigint;

    @Column({
        type: DataType.BIGINT,
       
    })
    campaign_id: bigint
    
    @Column({
        type: DataType.TEXT,
        
    })
    title : string

    @Column({
        type: DataType.TEXT,
        
    })
    description : string

    @Column({
        type: DataType.BIGINT,
       
    })
    merchant_id : bigint

    @Column({
        type: DataType.BIGINT,
        
    })
    rule_id : bigint

    @Column({
        type: DataType.TEXT,
        
        
    })
    promotion_type : string

    @Column({
        type: DataType.BOOLEAN,
    
        
    })
    is_global: boolean
    
   

    @Column({
        type: DataType.ARRAY(DataType.TEXT),
        defaultValue:[]
        
    })
    image_urls: string[]

    @Column({
        type: DataType.ARRAY(DataType.TEXT),
        defaultValue:[]
        
    })
    mobile_image_urls: string[]


    @Column({
        type: DataType.BIGINT,
    
        
    })
    group_id: bigint

    
    @Column({
        type: DataType.INTEGER,
        defaultValue : 0
    })
    idx : number
    

    @Column({
        type: DataType.TEXT
    })

        
    created_by_name : string

   //1 = admin/admin users, 2 = merchant/merchent users
    @Column({
        type: DataType.SMALLINT,
        defaultValue : 2
    })
    created_user_type : number


    @Column({
        type: DataType.DATE,
        defaultValue : Sequelize.literal("(now() at time zone 'utc')")
    })
    created_at : Date

    @Column({
        type: DataType.TEXT
    })
    approved_by : string

    @Column({
        type: DataType.DATE
    })
    approved_at : Date

    @Column({
        type: DataType.BOOLEAN,
        defaultValue : false
    })
    is_approved: boolean

    @Column({
        type: DataType.BOOLEAN,
        defaultValue : false
    })
    is_rejected: boolean

    @Column({
        type: DataType.TEXT
    })
    reject_msg : string

    @Column({
        type: DataType.TEXT
    })
    action : string

    @Column({
        type: DataType.TEXT
    })
    action_by : string

    @Column({
        type: DataType.TEXT
    })
    action_by_name : string

    @Column({
        type: DataType.DATE,
        defaultValue : Sequelize.literal("(now() at time zone 'utc')")
    })
    action_at : Date

    //1 = admin/admin users, 2 = merchant/merchent users
    @Column({
        type: DataType.SMALLINT,
        defaultValue : 2
    })
    action_by_user_type: number
    
}