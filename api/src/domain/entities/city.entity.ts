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
import { Area } from './area.entity';
import { Company } from './company.entity';
import { Department } from './department.entity';
import { Neighborhood } from './neighborhood.entity';

@Table({
  tableName: 'TBL_MTR_CITY',
  timestamps: false,
})
export class City extends Model<City> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  idCity: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  description: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  code: string;

  @ForeignKey(() => Department)
  @Column({ field: 'idDepartment' })
  idDepartment: number;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: true })
  isActive: boolean;

  @HasMany(() => Area)
  areas: Area[];

  @HasMany(() => Neighborhood)
  neighborhoods: Neighborhood[];

  @BelongsTo(() => Department, 'idDepartment') department: Department;
}
