import { Table, Column, Model, Sequelize, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'campaign_client' })
export class CampaignClientModel extends Model {
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
    name : string

    // will get from api..
    @Column({
        type: DataType.TEXT
    })
    currency_code : string
    
    @Column({
        type: DataType.TEXT
    })
    time_zone : string


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
    google_client_id: string

    @Column({
        type: DataType.DATE,
        defaultValue : Sequelize.literal("(now() at time zone 'utc')")
    })
    created_at : Date;
    
   

}