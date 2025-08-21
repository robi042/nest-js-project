import { Table, Column, Model, Sequelize, DataType, CreatedAt, UpdatedAt, HasMany  } from 'sequelize-typescript';
import { FacebookPageSubCategoryModel } from './index'

@Table({ tableName: 'facebook_page_category' })

export class FacebookPageCategoryModel extends Model{
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement : true,
        primaryKey : true
    })
    uid: number;

    @Column({
        type: DataType.BIGINT
    })
    id: bigint


    @Column({
        type: DataType.TEXT
    })
    name: string

    @Column({
        type: DataType.TEXT
    })
    api_enum: string;

    @HasMany(() => FacebookPageSubCategoryModel)
    subcategory: FacebookPageSubCategoryModel[]
}