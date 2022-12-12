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
import { Novelty } from './novelty.entity';
import { Route } from './route.entity';

@Table({
  tableName: 'TBL_ROUTE_NOVELTY',
  timestamps: false,
})
export class RouteNovelty extends Model<RouteNovelty> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  idRouteNovelty: number;

  @ForeignKey(() => Route)
  @Column({ field: 'idRoute' })
  idRoute: number;

  @ForeignKey(() => Novelty)
  @Column({ field: 'idNovelty' })
  idNovelty: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  description: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: DataType.NOW,
  })
  createdAt: Date;

  @BelongsTo(() => Route, 'idRoute') route: Route;
  @BelongsTo(() => Novelty, 'idNovelty') novelty: Novelty;
}
