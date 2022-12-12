import { Injectable } from '@nestjs/common';
import { CrudService } from './crud.service';
import { InjectModel } from '@nestjs/sequelize';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionService extends CrudService<Permission> {
  constructor(
    @InjectModel(Permission)
    model: typeof Permission,
  ) {
    super(model);
  }
}
