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
import { Permission } from './permission.entity';
import { Role } from './role.entity';

@Table({
  tableName: 'TBL_MTR_PERMISSION_ROLE',
  timestamps: false,
})
export class PermissionRole extends Model<PermissionRole> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  idPermissionRole: number;

  @ForeignKey(() => Permission)
  @Column({ field: 'idPermission' })
  idPermission: number;

  @ForeignKey(() => Role)
  @Column({ field: 'idRole' })
  idRole: number;

  @BelongsTo(() => Role, 'idRole') role: Role;
  @BelongsTo(() => Permission, 'idPermission') permission: Permission;
}
