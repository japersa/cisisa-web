import { Injectable } from '@nestjs/common';
import { CrudService } from './crud.service';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleService extends CrudService<Role> {
  constructor(
    @InjectModel(Role)
    model: typeof Role,
  ) {
    super(model);
  }
}
