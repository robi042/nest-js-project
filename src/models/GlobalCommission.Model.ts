import { Table, Column, Model, Sequelize, DataType, CreatedAt, UpdatedAt  } from 'sequelize-typescript';

@Table({ tableName: 'global_commission' })

export class GlobalCommissionModel extends Model{
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        autoIncrement : true,
        primaryKey : true
    })
    id: bigint;

    @Column({
        type: DataType.DOUBLE
    })
    commission_percentage: number


    @Column({
        type: DataType.TEXT
    })
    created_by: string

    @Column({
        type: DataType.DATE,
        defaultValue : Sequelize.literal("(now() at time zone 'utc')")
    })
    created_at: Date;

}