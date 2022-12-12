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
import { Neighborhood } from './neighborhood.entity';
import { Zone } from './zone.entity';

@Table({
  tableName: 'TBL_MTR_ZONE_NEIGHBORHOOD',
  timestamps: false,
})
export class ZoneNeighborhood extends Model<ZoneNeighborhood> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  idZoneNeighborhood: number;

  @ForeignKey(() => Zone)
  @Column({ field: 'idZone' })
  idZone: number;

  @ForeignKey(() => Neighborhood)
  @Column({ field: 'idNeighborhood' })
  idNeighborhood: number;

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  isActive: boolean;

  @BelongsTo(() => Zone, 'idZone') zone: Zone;
  @BelongsTo(() => Neighborhood, 'idNeighborhood') neighborhood: Neighborhood;
}
