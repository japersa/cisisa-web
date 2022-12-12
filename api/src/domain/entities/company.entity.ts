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
import { Headquarters } from './headquarters.entity';
import { Role } from './role.entity';

@Table({
  tableName: 'TBL_MTR_COMPANY',
  timestamps: false,
})
export class Company extends Model<Company> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  idCompany: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  description: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  lat: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  lon: string;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: true })
  isActive: boolean;

  @Column({ type: DataType.TEXT, allowNull: false })
  gcp_pwd: string;

  @HasMany(() => Address)
  addresses: Address[];

  @HasMany(() => Role)
  roles: Role[];
}
