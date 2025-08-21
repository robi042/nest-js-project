import { Table, Column, Model, Sequelize, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'google_currency_code' })
export class GoogleCurrencyModel extends Model {

    @Column({
        type: DataType.TEXT,
        allowNull : false
    })
    CurrencyName : string

    @Column({
        type: DataType.TEXT
    })
    currency_code : string
    

}