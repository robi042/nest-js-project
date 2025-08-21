import { Table, Column, Model, Sequelize, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'google_campaign_rule_history' })
export class GoogleCampaignRuleHistoryModel extends Model {
    @Column({
        type: DataType.BIGINT,
        autoIncrement : true,
        primaryKey: true
    })
    id: bigint;

    @Column({
        type: DataType.TEXT,
       
    })
    name : string

    @Column({
        type: DataType.TEXT,
        
    })
    amount : string

    @Column({
        type: DataType.INTEGER,
        
    })
    status : number

    @Column({
        type: DataType.TEXT,
        
    })
    advertisingChannelType : string

    @Column({
        type: DataType.TEXT,
        
        
    })
    customerId : string

    @Column({
        type: DataType.TEXT,
    
        
    })
    CampaignId: string
    
    @Column({
        type: DataType.TEXT,
    })
    budget_id : string

    @Column({
        type: DataType.TEXT
    })

    created_by_name: string
    
    @Column({
        type: DataType.TEXT
    })

    created_by : string

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
    approved_by: string

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

    @Column({
        type: DataType.INTEGER,
        defaultValue : 0
    })
    idx : number

    @Column({
        type: DataType.INTEGER,
    })
    business_id : number

    // action : "INSERT",
    // action_by : created_by,
    // action_by_name : created_by_name,
    // action_by_user_type: created_user_type,
    // idx,

       
}