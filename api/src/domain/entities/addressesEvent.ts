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
} from 'sequelize-typescript';
import { Address } from './address.entity';
import { User } from './user.entity';

@Table({
  tableName: 'TBL_MTR_ADDRESSES_EVENT',
  timestamps: false,
})
export class AddressesEvent extends Model<AddressesEvent> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  idAddressesEvent: number;

  @ForeignKey(() => Address)
  @Column({ field: 'idAddress' })
  idAddress: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  event: string;

  @Column({ type: DataType.JSON, allowNull: false })
  data: object;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: DataType.NOW,
  })
  createdAt: Date;

  @ForeignKey(() => User)
  @Column
  idCreationUser: number;

  @BelongsTo(() => Address, 'idAddress') address: Address;
  @BelongsTo(() => User) user: User;
}
