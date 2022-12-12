import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  Sequelize,
} from 'sequelize-typescript';
import { Address } from './address.entity';
import { User } from './user.entity';

@Table({
  tableName: 'TBL_ROUTE',
  timestamps: false,
})
export class Route extends Model<Route> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  idRoute: number;

  @ForeignKey(() => Address)
  @Column({ field: 'idAddress' })
  idAddress: number;

  @ForeignKey(() => User)
  @Column({ field: 'idUser' })
  idUser: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    defaultValue: DataType.NOW,
  })
  assignedDate: Date;

  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: -1 })
  state: number;

  @BelongsTo(() => Address, 'idAddress') address: Address;
  @BelongsTo(() => User, 'idUser') courier: User;
}
