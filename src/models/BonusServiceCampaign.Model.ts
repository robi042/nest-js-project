import { Table, Column, Model, Sequelize, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'bonus_service_campaign' })
export class BonusServiceCampaignModel extends Model {
    @Column({
        type: DataType.BIGINT,
        autoIncrement : true,
        primaryKey: true
    })
    id: bigint;
    
    @Column({
        type: DataType.BIGINT
        
        
    })
    group_id: bigint

    @Column({
        type: DataType.BIGINT
        
        
    })
    map_group_id: bigint
  

}