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
import { Neighborhood } from './neighborhood.entity';
import { Zone } from './zone.entity';

@Table({
  tableName: 'TBL_MTR_ADDRESS',
  timestamps: false,
})
export class Address extends Model<Address> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  idAddress: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  guide: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  name: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  direction: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  reference1: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  reference2: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  clientGuide: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declaredValue: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  state: number;

  @ForeignKey(() => Neighborhood)
  @Column({ field: 'idNeighborhood' })
  idNeighborhood: number;

  @ForeignKey(() => City)
  @Column({ field: 'idCity' })
  idCity: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  lat: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  lon: string;

  @ForeignKey(() => Company)
  @Column({ field: 'idCompany' })
  idCompany: number;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: true })
  isActive: boolean;

  @Column({ type: DataType.TEXT, allowNull: true })
  remitent: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  collection: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  product: string;

  @ForeignKey(() => Zone)
  @Column({ field: 'idZone', allowNull: true })
  idZone: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: DataType.NOW,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  updatedAt: Date;

  @BelongsTo(() => Neighborhood, 'idNeighborhood') neighborhood: Neighborhood;
  @BelongsTo(() => City, 'idCity') city: City;
  @BelongsTo(() => Company, 'idCompany') company: Company;
  @BelongsTo(() => Zone, 'idZone') zone: Zone;
}
