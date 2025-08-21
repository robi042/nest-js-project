import { Table, Column, Model, Sequelize, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'customer_wallet_temp' })
export class CustomerWalletTempModel extends Model {
    @Column({
        type: DataType.BIGINT,
        autoIncrement : true,
        primaryKey: true
    })
    id: bigint;

    @Column({
        type: DataType.DOUBLE
    })

    proposed_budget: number


    @Column({
        type: DataType.DOUBLE
    })
        
    current_balance: number

        
    @Column({
        type: DataType.INTEGER,
        defaultValue : 0
    })
    idx : number

        
    @Column({
        type: DataType.DOUBLE
    })

    previous_balance: number


    @Column({
        type: DataType.TEXT
    })

    created_by_name: string
    
   //1 = admin/admin users, 2 = merchant/merchent users
    @Column({
        type: DataType.SMALLINT,
        defaultValue : 2
    })
    created_user_type : number


    @Column({
        type: DataType.DATE,
        defaultValue : Sequelize.literal("(now() at time zone 'utc')")
    })
    created_at : Date

    @Column({
        type: DataType.TEXT
    })
    approved_by: string
    
    @Column({
        type: DataType.DOUBLE,
       
    })
    admin_commission: number

    @Column({
        type: DataType.DATE
    })
    approved_at : Date

    @Column({
        type: DataType.BOOLEAN,
        defaultValue : false
    })
    is_approved: boolean

    @Column({
        type: DataType.BOOLEAN,
        defaultValue : false
    })
    is_rejected: boolean

    @Column({
        type: DataType.TEXT
    })
    reject_msg : string

    @Column({
        type: DataType.TEXT
    })
    action : string

    @Column({
        type: DataType.TEXT
    })
    action_by : string

    @Column({
        type: DataType.TEXT
    })
    action_by_name : string

    @Column({
        type: DataType.DATE,
        defaultValue : Sequelize.literal("(now() at time zone 'utc')")
    })
    action_at: Date
    
    @Column({
        type: DataType.TEXT,
        allowNull : false
    })
    created_by: string
    
    @Column({
        type: DataType.BIGINT,
        
    })
    update_id: bigint;

    //1 = admin/admin users, 2 = merchant/merchent users
    
}