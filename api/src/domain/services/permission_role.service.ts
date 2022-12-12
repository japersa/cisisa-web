import { Injectable } from '@nestjs/common';
import { CrudService } from './crud.service';
import { InjectModel } from '@nestjs/sequelize';
import { PermissionRole } from '../entities/permission_role.entity';

@Injectable()
export class PermissionRoleService extends CrudService<PermissionRole> {
  constructor(
    @InjectModel(PermissionRole)
    model: typeof PermissionRole,
  ) {
    super(model);
  }

  async deleteByRole(idRole) {
    return await this.deleteAll({ where: { idRole: idRole } });
  }
}
