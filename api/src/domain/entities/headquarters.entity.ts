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
import { City } from './city.entity';
import { Company } from './company.entity';

@Table({
  tableName: 'TBL_MTR_HEADQUARTERS',
  timestamps: false,
})
export class Headquarters extends Model<Headquarters> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  idHeadquarters: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  nameHeadquarters: string;

  @ForeignKey(() => City)
  @Column({ field: 'idCity' })
  idCity: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  description: string;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: true })
  isActive: boolean;

  @ForeignKey(() => Company)
  @Column({ field: 'idCompany' })
  idCompany: number;

  @BelongsTo(() => City, 'idCity') city: City;
  @BelongsTo(() => Company, 'idCompany') company: Company;
}
