import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Route } from './route.entity';
import { RouteObservation } from './routeObservation.entity';

@Table({
  tableName: 'TBL_ROUTE_DETAIL',
  timestamps: false,
})
export class RouteDetail extends Model<RouteDetail> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  idRouteDetail: number;

  @ForeignKey(() => Route)
  @Column({ field: 'idRoute' })
  idRoute: number;

  @ForeignKey(() => RouteObservation)
  @Column({ field: 'idRouteObservation', allowNull: true })
  idRouteObservation: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  novelty: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  picture: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  signature: string;

  @BelongsTo(() => Route, 'idRoute') route: Route;
  @BelongsTo(() => RouteObservation, 'idRouteObservation')
  routeObservation: RouteObservation;

  @Column({ field: 'deliveryStatus' })
  deliveryStatus: number;
}
