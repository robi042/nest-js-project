import { Table, Column, Model, Sequelize, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'campaign_rule' })
export class CampaignRuleModel extends Model {
    @Column({
        type: DataType.BIGINT,
        autoIncrement : true,
        primaryKey: true
    })
    id: bigint;

    @Column({
        type: DataType.TEXT,
       
    })
    rule_name : string

    @Column({
        type: DataType.INTEGER,
        
    })
    gender : number

    @Column({
        type: DataType.INTEGER,
        
    })
    max_age : number

    @Column({
        type: DataType.INTEGER,
        
    })
    min_age : number

    @Column({
        type: DataType.TEXT,
    
        
    })
    country: string
    
    @Column({
        type: DataType.INTEGER,
        defaultValue : 0
    })
    idx : number

    @Column({
        type: DataType.ARRAY(DataType.TEXT),
        defaultValue:[]
        
    })
    region : string[]

    @Column({
        type: DataType.ARRAY(DataType.TEXT),
        defaultValue:[]
        
    })
    behavior : string[]

    @Column({
        type: DataType.ARRAY(DataType.TEXT),
        defaultValue:[]
        
    })
    interest: string[]
    
    @Column({
        type: DataType.ARRAY(DataType.TEXT),
        defaultValue:[]
        
    })
    life_event: string[]
    
    @Column({
        type: DataType.ARRAY(DataType.INTEGER),
        defaultValue:[]
        
    })
    relationship_status: number[]
    
    @Column({
        type: DataType.ARRAY(DataType.TEXT),
        defaultValue:[]
        
    })
    device_platform: string[]
    
    @Column({
        type: DataType.ARRAY(DataType.TEXT),
        defaultValue:[]
        
    })
    user_os : string[]

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
        type: DataType.TEXT,
        
    })
    group  : string

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
        type: DataType.BOOLEAN,
        defaultValue : false
    })
    isCustomizeGroup : boolean

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
        type: DataType.ARRAY(DataType.TEXT),
        defaultValue:[]
    })
    keyword: string[]
    
    @Column({
        type: DataType.TEXT
    })
    income: string
    
    @Column({
        type: DataType.DOUBLE
    })
    longtitude: number
    
    @Column({
        type: DataType.DOUBLE
    })
    latitude: number
    
    @Column({
        type: DataType.TEXT
    })
    radius_unit: string
    
    @Column({
        type: DataType.TEXT
    })
    country_code: string
    
    @Column({
        type: DataType.TEXT
    })
    province_name: string
    
    @Column({
        type: DataType.TEXT
    })
    province_code: string
    
    @Column({
        type: DataType.TEXT
    })
    postal_code: string
    
    @Column({
        type: DataType.TEXT
    })
    city_name: string
    
    @Column({
        type: DataType.TEXT
    })
    street_address: string
    
    @Column({
        type: DataType.DOUBLE
    })
    radius: number
    
    @Column({
        type: DataType.TEXT
    })
    campaign_objective: string

    @Column({
        type: DataType.TEXT
    })
    campaginId_Faecbook: string
    
    @Column({
        type: DataType.TEXT
    })
    campaignId_Google: string
    
    @Column({
        type: DataType.TEXT
    })
    daily_budget: string
    
    @Column({
        type: DataType.ARRAY(DataType.TEXT),
        defaultValue:[]
    })
    interest_id  : any

    @Column({
        type: DataType.DATE,
        
    })
    start_date: Date
    
    @Column({
        type: DataType.DATE,
      
    })
    expired_date : Date

    @Column({
        type: DataType.TEXT
    })
    rule_type: string

    @Column({
        type: DataType.TEXT
    })
    group_name: string

    @Column({
        type: DataType.TEXT
    })
    ad_campaign: string

    
}