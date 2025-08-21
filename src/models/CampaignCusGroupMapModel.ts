import { Table, Column, Model, Sequelize, DataType, CreatedAt, UpdatedAt, AllowNull } from 'sequelize-typescript';

@Table({ tableName: 'campaign_cus_group_map' })
export class CampaignCusGroupMapModel extends Model {
    @Column({
        type: DataType.BIGINT,
        autoIncrement : true,
        primaryKey: true
    })
    id: bigint;

    @Column({
        type: DataType.BIGINT,
        allowNull : false
    })
    group_id : bigint;
    
    @Column({
        type: DataType.TEXT,
        allowNull : false
    })
    msisdn : string;
    
    @Column({
        type: DataType.TEXT
    })
    email : string;
    
}