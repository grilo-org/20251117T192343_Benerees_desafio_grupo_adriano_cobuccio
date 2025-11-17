import {
    Table,
    Model,
    Column,
    DataType,
    PrimaryKey,
    Default,
    BeforeCreate,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

@Table({ tableName: 'users', timestamps: true, paranoid: true })
export class User extends Model<User> {
    @PrimaryKey
    @Default(uuidv4)
    @Column({ type: DataType.UUID })
    declare id: string;

    @Column({ allowNull: false })
    declare name: string;

    @Column({ allowNull: false, unique: true })
    declare email: string;

    @Column({ allowNull: false })
    declare password: string;

    @Default('0.00')
    @Column({ type: DataType.DECIMAL(14, 2), allowNull: false })
    declare balance: string;

    @Default('user')
    @Column({ allowNull: false })
    declare role: string;

    @Column({ type: DataType.DATE })
    declare deletedAt?: Date;

    @BeforeCreate
    static setId(instance: User) {
        if (!instance.id) instance.id = uuidv4();
    }
}
