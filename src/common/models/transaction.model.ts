import {
    Table,
    Model,
    Column,
    DataType,
    PrimaryKey,
    Default,
    ForeignKey,
    BelongsTo,
    BeforeCreate,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.model';

export type TransactionStatus = 'completed' | 'reversed';

@Table({ tableName: 'transactions', timestamps: true })
export class TransactionModel extends Model<TransactionModel> {
    @PrimaryKey
    @Default(uuidv4)
    @Column({ type: DataType.UUID })
    declare id: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    declare senderId: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    declare receiverId: string;

    @Column({ type: DataType.DECIMAL(14, 2), allowNull: false })
    declare amount: string;

    @Default('pending')
    @Column({
        type: DataType.ENUM('pending', 'completed', 'reversed'),
        allowNull: false,
    })
    declare status: TransactionStatus;

    @BelongsTo(() => User, 'senderId')
    declare sender: User;

    @BelongsTo(() => User, 'receiverId')
    declare receiver: User;

    @BeforeCreate
    static setId(instance: TransactionModel) {
        if (!instance.id) instance.id = uuidv4();
    }
}
