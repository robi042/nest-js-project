import { Table, Column, Model, Sequelize, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'google_timezone' })
export class GoogleTimezoneModel extends Model {

    @Column({
        type: DataType.TEXT,
        allowNull : false
    })
    Timezone : string

    

}