import { Table, Column, Model, Sequelize, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'bilk_notifications' })
export class NotificationModel extends Model {
    @Column({
        type: DataType.BIGINT,
        autoIncrement : true,
        primaryKey: true
    })
    id: bigint;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    Notification_Title: string;

    @Column({
        type: DataType.STRING(200),
        allowNull: false,
    })
    Notification_Body: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: true
    })
    viaSMS: boolean;
   
    @Column({
        type: DataType.BOOLEAN,
        allowNull: true
    })
    viaEmail: boolean;
   
    @Column({
        type: DataType.BOOLEAN,
        allowNull: true
    })
    viaPushNotification: boolean;

    @Column({
        type: DataType.STRING(20)
    })
    Created_By: string;

    @Column({
        type: DataType.SMALLINT,
        defaultValue : 2
    })
    user_type: number;

    @Column({
        type: DataType.DATE,
        defaultValue : Sequelize.literal("(now() at time zone 'utc')")
    })
    Created_Date: Date;

}