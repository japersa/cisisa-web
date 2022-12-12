import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { Department } from './department.entity';

@Table({
  tableName: 'TBL_MTR_COUNTRY',
  timestamps: false,
})
export class Country extends Model<Country> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  idCountry: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  description: string;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: true })
  isActive: boolean;

  @HasMany(() => Department)
  departments: Department[];
}
