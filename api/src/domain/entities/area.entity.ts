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
import { Zone } from './zone.entity';

@Table({
  tableName: 'TBL_MTR_AREA',
  timestamps: false,
})
export class Area extends Model<Area> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  idArea: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  description: string;

  @ForeignKey(() => City)
  @Column({ field: 'idCity' })
  idCity: number;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: true })
  isActive: boolean;

  @BelongsTo(() => City, 'idCity') city: City;
}
