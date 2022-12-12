import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.entity';

@Table({
  tableName: 'TBL_REFRESH_TOKEN',
  timestamps: false,
})
export class RefreshToken extends Model<RefreshToken> {
  @ForeignKey(() => User)
  @Column({ field: 'idUser' })
  idUser: number;
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isRevoked: boolean;
  @Column({ type: DataType.DATE, allowNull: false })
  expires: Date;
  @BelongsTo(() => User, 'idUser') User: User;
}
