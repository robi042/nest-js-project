import { Table, Column, Model, Sequelize, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'campaign_bulk_notification_without_group_history' })
export class CampaignBulkNotificationWithoutGroupHistoryModel extends Model {
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
    title : string;
    
    @Column({
        type: DataType.TEXT,
        allowNull : false
    })
    body : string;
   
    @Column({
        type: DataType.TEXT,
        allowNull : false
    })
    msisdn : string;
    
    @Column({
        type: DataType.TEXT
    })
    email : string;

    @Column({
        type: DataType.BIGINT,
        allowNull : false
    })
    channel_map_id : bigint;
   
    @Column({
        type: DataType.TEXT,
        allowNull : false
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
        type: DataType.DATE,
        defaultValue : Sequelize.literal("(now() at time zone 'utc')")
    })
    approved_at : Date;
    
    @Column({
        type: DataType.DATE,
        defaultValue : Sequelize.literal("(now() at time zone 'utc')")
    })
    created_at : Date;

    @Column({
        type: DataType.TEXT
    })
    action : string;

}