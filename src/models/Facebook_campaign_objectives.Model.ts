import { Table, Column, Model, Sequelize, DataType, CreatedAt, UpdatedAt  } from 'sequelize-typescript';

@Table({ tableName: 'facebook_campaign_objectives' })

export class FacebookCampaignObjectivesModel extends Model{
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        autoIncrement : true,
        primaryKey : true
    })
    id: bigint;

    @Column({
        type: DataType.TEXT
    })
    objectives: string
  

}