import { Table, Column, Model, Sequelize, DataType, CreatedAt, UpdatedAt, AllowNull, ForeignKey } from 'sequelize-typescript';

@Table({ tableName: 'campaign_channels' })
export class CampaignChannelsModel extends Model {

    @Column({
        type: DataType.SMALLINT,
        autoIncrement : true,
        primaryKey: true
    })
    id: number;

    @Column({
        type: DataType.TEXT,
        allowNull : false
    })
    channel_name : string;
    
    @Column({
        type: DataType.BOOLEAN
    })
    is_need_quota : boolean;
    
    @Column({
        type: DataType.TEXT,
        allowNull : false
    })
    key_name : string;
    
    @Column({
        type: DataType.BOOLEAN
    })
    bulk_notification : boolean;

    @Column({
        type: DataType.BOOLEAN
    })
    is_active : boolean;


}