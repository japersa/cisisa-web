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
import { City } from './city.entity';
import { Company } from './company.entity';
import { ZoneNeighborhood } from './zone_neighborhood.entity';

@Table({
  tableName: 'TBL_MTR_ZONE',
  timestamps: false,
})
export class Zone extends Model<Zone> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  idZone: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  description: string;

  @Column({ type: DataType.JSON, allowNull: true })
  properties: object;

  @Column({ type: DataType.JSON, allowNull: true })
  geometry: object;

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  isActive: boolean;

  @ForeignKey(() => Company)
  @Column({ field: 'idCompany', allowNull: true })
  idCompany: number;

  @ForeignKey(() => City)
  @Column({ field: 'idCity', allowNull: true })
  idCity: number;

  @HasMany(() => ZoneNeighborhood)
  zonesNeighborhoods: ZoneNeighborhood[];

  @BelongsTo(() => Company, 'idCompany') company: Company;
  @BelongsTo(() => City, 'idCity') city: City;
}
