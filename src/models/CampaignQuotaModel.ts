import { Table, Column, Model, Sequelize, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'campaign_quota' })
export class CampaignQuotaModel extends Model {
    @Column({
        type: DataType.BIGINT,
        autoIncrement : true,
        primaryKey: true
    })
    id: bigint;

    @Column({
        type: DataType.DOUBLE,
        defaultValue : 0
    })
    facebook : number

    @Column({
        type: DataType.DOUBLE,
        defaultValue : 0
    })
    google : number

    @Column({
        type: DataType.DOUBLE,
        defaultValue : 0
    })
    whatsapp : number

    @Column({
        type: DataType.DOUBLE,
        defaultValue : 0
    })
    sms : number

    @Column({
        type: DataType.DOUBLE,
        defaultValue : 0
    })
    email : number

    @Column({
        type: DataType.DOUBLE,
        defaultValue : 0
    })
    push_notification : number

    @Column({
        type: DataType.DOUBLE,
        defaultValue : 0
    })
    instagram : number

    @Column({
        type: DataType.DOUBLE,
        defaultValue : 0
    })
    twitter : number

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
    title: string
    
    @Column({
        type: DataType.TEXT
    })
    total_budget : string
}

