import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { City } from './city.entity';
import { Country } from './country.entity';

@Table({
  tableName: 'TBL_MTR_DEPARMENT',
  timestamps: false,
})
export class Department extends Model<Department> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  idDepartment: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  description: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  code: string;

  @ForeignKey(() => Country)
  @Column({ field: 'idCountry' })
  idCountry: number;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: true })
  isActive: boolean;

  @HasMany(() => City)
  cities: City[];

  @BelongsTo(() => Country, 'idCountry') country: Country;
}
