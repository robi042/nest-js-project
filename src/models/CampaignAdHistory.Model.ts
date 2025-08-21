import { Table, Column, Model, Sequelize, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'campaign_ad_history' })
export class CampaignAdHistoryModel extends Model {
    @Column({
        type: DataType.BIGINT,
        autoIncrement : true,
        primaryKey: true
    })
    id: bigint;

    @Column({
        type: DataType.TEXT,
       
    })
    page_id : string

    @Column({
        type: DataType.TEXT,
        
    })
    body : string

    @Column({
        type: DataType.TEXT,
        
    })
    effective_instagram_media_id : string

    @Column({
        type: DataType.TEXT,
        
    })
    image_url : string

    @Column({
        type: DataType.TEXT,
        
        
    })
    image : string

    @Column({
        type: DataType.TEXT,
    
        
    })
    link_url: string
    
    @Column({
        type: DataType.INTEGER,
        defaultValue : 0
    })
    idx : number

    @Column({
        type: DataType.INTEGER,
        
        
    })
    thumbnail_height : number

    @Column({
        type: DataType.INTEGER,
        
        
    })
    thumbnail_width : number

    @Column({
        type: DataType.TEXT,
        
        
    })
    instagram_actor_id: string
    
    @Column({
        type: DataType.TEXT,
        
        
    })
    title: string
    

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
    action_by_user_type:number

    @Column({
        type: DataType.BOOLEAN,
        defaultValue : false
    })
    isInstagram: boolean

    @Column({
        type: DataType.BOOLEAN,
        defaultValue : false
    })
    isGoogle: boolean

    @Column({
        type: DataType.BOOLEAN,
        defaultValue : false
    })
    isFacebook: boolean

    @Column({
        type: DataType.TEXT
    })
    image_hash: string
    
    @Column({
        type: DataType.BIGINT
    })
    campaign_id: bigint

    @Column({
        type: DataType.BOOLEAN,
        defaultValue : false
    })
    is_fb_page_post: boolean

    @Column({
        type: DataType.ARRAY(DataType.INTEGER),
        
        
    })
    fb_page_post_category_ids: number[]
    

    @Column({
        type: DataType.ARRAY(DataType.INTEGER),
        
        
    })
    facebookpage_subcategory_localuids: number[]
    
    @Column({
        type: DataType.TEXT
    })
    facebook_adcreative_id: string

    @Column({
        type: DataType.TEXT
    })
    facebook_ad_id: string
}