import { Table, Column, Model, Sequelize, DataType, CreatedAt, UpdatedAt, ForeignKey  } from 'sequelize-typescript';
import { FacebookPageCategoryModel } from './index'

@Table({ tableName: 'facebook_page_subcategory' })

export class FacebookPageSubCategoryModel extends Model{
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement : true,
        primaryKey : true
    })
    uid: number;

    @ForeignKey(() => FacebookPageCategoryModel)
    @Column({
        type: DataType.INTEGER
    })
    category_id: number

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

}