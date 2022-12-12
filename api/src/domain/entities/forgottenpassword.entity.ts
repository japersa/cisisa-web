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
  tableName: 'TBL_FORGOTTEN_PASSWORD',
  timestamps: false,
})
export class ForgottenPassword extends Model<ForgottenPassword> {
  @ForeignKey(() => User)
  @Column({ field: 'idUser' })
  idUser: number;
  @Column({ type: DataType.TEXT, allowNull: false })
  email: string;
  @Column({ type: DataType.TEXT, allowNull: false })
  newPasswordToken: string;
  @Column({ type: DataType.DATE, allowNull: false })
  timestamp: Date;
  @BelongsTo(() => User, 'idUser') User: User;
}
