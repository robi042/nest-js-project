import { Table, Column, Model, Sequelize, DataType, CreatedAt, UpdatedAt, AllowNull } from 'sequelize-typescript';

@Table({ tableName: 'campaign_cus_group_history' })
export class CampaignCusGroupHistoryModel extends Model {
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
    group_name : string;
    
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
        type: DataType.DATE,
        defaultValue : Sequelize.literal("(now() at time zone 'utc')")
    })
    created_at : Date;

    @Column({
        type: DataType.INTEGER
    })
    idx : number;
    
    @Column({
        type: DataType.TEXT
    })
    approved_by : string;

    @Column({
        type: DataType.DATE
    })
    approved_at : Date;

    @Column({
        type: DataType.TEXT
    })
    action : string;
}