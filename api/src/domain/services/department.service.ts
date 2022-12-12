import { Injectable } from '@nestjs/common';
import { CrudService } from './crud.service';
import { InjectModel } from '@nestjs/sequelize';
import { Department } from '../entities/department.entity';

@Injectable()
export class DepartmentService extends CrudService<Department> {
  constructor(
    @InjectModel(Department)
    model: typeof Department,
  ) {
    super(model);
  }
}
