import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'TBL_MTR_PRB',
  timestamps: false,
})
export class Prb extends Model<Prb> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  idPrb: number;
  @Column({ type: DataType.TEXT, allowNull: true })
  d_codigo: string;
  @Column({ type: DataType.TEXT, allowNull: true })
  d_asenta: string;
  @Column({ type: DataType.TEXT, allowNull: true })
  d_tipo_asenta: string;
  @Column({ type: DataType.TEXT, allowNull: true })
  d_mnpio: string;
  @Column({ type: DataType.TEXT, allowNull: true })
  d_estado: string;
  @Column({ type: DataType.TEXT, allowNull: true })
  d_ciudad: string;
  @Column({ type: DataType.TEXT, allowNull: true })
  d_CP: string;
  @Column({ type: DataType.TEXT, allowNull: true })
  c_estado: string;
  @Column({ type: DataType.TEXT, allowNull: true })
  c_oficina: string;
  @Column({ type: DataType.TEXT, allowNull: true })
  c_CP: string;
  @Column({ type: DataType.TEXT, allowNull: true })
  c_tipo_asenta: string;
  @Column({ type: DataType.TEXT, allowNull: true })
  c_mnpio: string;
  @Column({ type: DataType.TEXT, allowNull: true })
  id_asenta_cpcons: string;
  @Column({ type: DataType.TEXT, allowNull: true })
  d_zona: string;
  @Column({ type: DataType.TEXT, allowNull: true })
  c_cve_ciudad: string;
}
