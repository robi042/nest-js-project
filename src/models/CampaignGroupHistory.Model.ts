import { Table, Column, Model, Sequelize, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'campaign_group_history' })
export class CampaignGroupHistoryModel extends Model {
    @Column({
        type: DataType.BIGINT,
        autoIncrement : true,
        primaryKey: true
    })
    id: bigint;

    @Column({
        type: DataType.TEXT
        
    })
    group_name : string

    @Column({
        type: DataType.INTEGER,
        
    })
    type : number

    @Column({
        type: DataType.BOOLEAN,
        
    })
    isDefault : boolean

    @Column({
        type: DataType.BOOLEAN,
       
    })
    status : boolean

    @Column({
        type: DataType.INTEGER
        
    })
    creation_type : number


    @Column({
        type: DataType.TEXT
        
    })
    csv_file_name : string

    @Column({
        type: DataType.ARRAY(DataType.TEXT),
        defaultValue:[]
        
    })
    gender: string[]
    
    @Column({
        type: DataType.ARRAY(DataType.TEXT),
        defaultValue:[]
        
    })
    carrier: string[]
    
    @Column({
        type: DataType.TEXT
        
    })
    hand_set_type: string
    
    @Column({
        type: DataType.ARRAY(DataType.TEXT),
        defaultValue:[]
        
    })
    age: string[]
    
 
    
    @Column({
        type: DataType.DOUBLE
        
    })
    income: number
    
    @Column({
        type: DataType.ARRAY(DataType.TEXT),
        defaultValue:[]
        
    })
    location: string[]
    
    @Column({
        type: DataType.TEXT
        
    })
    connection_type : string
   

    @Column({
        type: DataType.TEXT,
        allowNull : false
    })
    created_by : string

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
        type: DataType.INTEGER,
        defaultValue : 0
    })
    idx : number

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
    reject_msg: string
    
    @Column({
        type: DataType.TEXT
    })
    facebook_campaign_id: string
    
    @Column({
        type: DataType.TEXT
    })
    google_campaign_id: string
    
    
    @Column({
        type: DataType.ARRAY(DataType.TEXT),
        defaultValue:[]
        
    })
    member_list: string[]


    @Column({
        type: DataType.ARRAY(DataType.TEXT),
        defaultValue:[]
        
    })
    division: string[]

    @Column({
        type: DataType.INTEGER,
        defaultValue : 0
    })
    group_member_count: number
    
     //new for brac

     @Column({
        type: DataType.TEXT
    })
    religions: string

    @Column({
        type: DataType.TEXT
    })
    marital_status: string

    @Column({
        type: DataType.TEXT
    })
    occupation: string

    @Column({
        type: DataType.TEXT
    })
    account_opening_date: string

    @Column({
        type: DataType.TEXT
    })
    branch_name: string

    @Column({
        type: DataType.TEXT
    })
    ca_sa_product_description: string

    @Column({
        type: DataType.TEXT
    })
    casa_acct_status: string

    @Column({
        type: DataType.TEXT
    })
    has_loan: string

    @Column({
        type: DataType.TEXT
    })
    has_credit_card: string

    @Column({
        type: DataType.TEXT
    })
    has_debit_card: string

    @Column({
        type: DataType.TEXT
    })
    customer_type: string

    @Column({
        type: DataType.TEXT
    })
    last_login_type: string
}