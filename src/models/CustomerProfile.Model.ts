import { Table, Column, Model, Sequelize, DataType, CreatedAt, UpdatedAt  } from 'sequelize-typescript';

@Table({ tableName: 'customerprofile' })

export class CustomerProfileModel extends Model{
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        autoIncrement : true,
        primaryKey : true
    })
    id: bigint;

    @Column({
        type: DataType.BIGINT
    })
    idx: bigint

    @Column({
        type: DataType.BIGINT
    })
    mobile: bigint


    @Column({
        type: DataType.DOUBLE
    })
    customer_balance: number

   

}