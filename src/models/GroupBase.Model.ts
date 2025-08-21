import { Table, Column, Model, Sequelize, DataType, CreatedAt, UpdatedAt,ForeignKey } from 'sequelize-typescript';


@Table({ tableName: 'group_base' })
export class GroupBaseModel extends Model {

    @Column({
        type: DataType.BIGINT,
        autoIncrement : true,
        primaryKey: true
    })
    id: bigint;

    @Column({
        type: DataType.TEXT,
       
    })
    msisdn : string

    @Column({
        type: DataType.INTEGER,
        
    })
    email : number


    @Column({
        type: DataType.TEXT,
        
        
    })
    device_id: string
    
    
    @Column({
        type: DataType.BIGINT,
    
        
    })
    group_id: number

    @Column({
        type: DataType.TEXT,
        
        
    })
    group_name : string
    


    @Column({
        type: DataType.DATE,
        defaultValue : Sequelize.literal("(now() at time zone 'utc')")
    })
    created_at : Date

 
    
}
