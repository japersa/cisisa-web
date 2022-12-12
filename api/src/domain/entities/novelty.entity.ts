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

@Table({
  tableName: 'TBL_NOVELTY',
  timestamps: false,
})
export class Novelty extends Model<Novelty> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  idNovelty: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  description: string;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: true })
  isActive: boolean;
}
