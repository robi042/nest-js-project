import { Table, Column, Model, Sequelize, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'campaign_config' })
export class CampaignConfigModel extends Model {
    @Column({
        type: DataType.BIGINT,
        autoIncrement : true,
        primaryKey: true
    })
    id: bigint;

    @Column({
        type: DataType.TEXT,
        allowNull : false
    })
    keyword : string

    // will get from api..
    @Column({
        type: DataType.TEXT
    })
    user_access_token : string
    
    @Column({
        type: DataType.TEXT
    })
    user_access_token_expire_at : string

    @Column({
        type: DataType.TEXT
    })
    page_id : string

    @Column({
        type: DataType.TEXT
    })
    page_name : string

    @Column({
        type: DataType.TEXT
    })
    facebook_pagepost_page_id: string

    @Column({
        type: DataType.TEXT
    })
    page_access_token : string

    @Column({
        type: DataType.TEXT
    })
    facebook_user_id : string

    @Column({
        type: DataType.TEXT
    })
    app_id : string

    @Column({
        type: DataType.TEXT
    })
    app_secret : string

    @Column({
        type: DataType.TEXT
    })
    user_token : string

    @Column({
        type: DataType.TEXT
    })
    ad_account_id : string

    @Column({
        type: DataType.STRING(50)
    })
    created_by : string

    @Column({
        type: DataType.SMALLINT,
        defaultValue : 2
    })
    created_user_type: number
    
    @Column({
        type: DataType.TEXT
    })
    google_refresh_token: string

    @Column({
        type: DataType.TEXT
    })
    instagram_actor_id:string
    
    @Column({
        type: DataType.TEXT
    })
    google_client_secret: string
    
    @Column({
        type: DataType.TEXT
    })
    google_client_id: string
    
    @Column({
        type: DataType.TEXT
    })
    email_address: string
    
    @Column({
        type: DataType.TEXT
    })
    email_password: string
    
    @Column({
        type: DataType.TEXT
    })
    fcm_server_ring: string
    
    @Column({
        type: DataType.INTEGER,
        
    })
    email_port: number

    @Column({
        type: DataType.INTEGER
    })
    email_config_type : number

    @Column({
        type: DataType.TEXT
    })
    email_service : string

    @Column({
        type: DataType.TEXT
    })
    email_host : string

    @Column({
        type: DataType.TEXT
    })
    google_developer_token : string

    @Column({
        type: DataType.DATE,
        defaultValue : Sequelize.literal("(now() at time zone 'utc')")
    })
    created_at: Date;

    @Column({
        type: DataType.TEXT
    })
    google_customer_id : string

    @Column({
        type: DataType.BOOLEAN
    })
    allow_admin_facebook_page_post : boolean

    @Column({
        type: DataType.BOOLEAN
    })
    allow_other_merchant_facebook_page_post : boolean

    @Column({
        type: DataType.BIGINT
    })
    facebook_page_category_localuid: bigint

    @Column({
        type: DataType.INTEGER
    })
    facebookpage_subcategory_localuid: number
}