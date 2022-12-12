import {
  Column,
  DataType,
  Model,
  Table,
  HasMany,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Address } from './address.entity';
import { City } from './city.entity';
import { Zone } from './zone.entity';
import { ZoneNeighborhood } from './zone_neighborhood.entity';

@Table({
  tableName: 'TBL_MTR_NEIGHBORHOOD',
  timestamps: false,
})
export class Neighborhood extends Model<Neighborhood> {
  @PrimaryKey
  @AutoIncrement
  @Column({ primaryKey: true, autoIncrement: true })
  idNeighborhood: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  description: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  lat: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  lan: string;

  @ForeignKey(() => City)
  @Column({ field: 'idCity' })
  idCity: number;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: true })
  isActive: boolean;

  @HasMany(() => Address)
  addresses: Address[];

  @HasMany(() => ZoneNeighborhood)
  zonesNeighborhoods: ZoneNeighborhood[];

  @BelongsTo(() => City, 'idCity') city: City;
}
