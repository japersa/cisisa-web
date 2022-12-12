import { Injectable } from '@nestjs/common';
import { CrudService } from './crud.service';
import { InjectModel } from '@nestjs/sequelize';
import { Area } from '../entities/area.entity';

@Injectable()
export class AreaService extends CrudService<Area> {
  constructor(
    @InjectModel(Area)
    model: typeof Area,
  ) {
    super(model);
  }
}
