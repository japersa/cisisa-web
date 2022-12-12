import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'TBL_ROUTE_OBSERVATION',
  timestamps: false,
})
export class RouteObservation extends Model<RouteObservation> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  idRouteObservation: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  observation: string;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: true })
  isActive: boolean;
}
