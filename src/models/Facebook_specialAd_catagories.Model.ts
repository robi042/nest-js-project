import { Table, Column, Model, Sequelize, DataType, CreatedAt, UpdatedAt  } from 'sequelize-typescript';

@Table({ tableName: 'facebook_specialAd_catagories' })

export class FacebookSpecialAdCatagoriesModel extends Model{
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
    catagories: string
  

}