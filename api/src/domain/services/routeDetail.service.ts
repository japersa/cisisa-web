import { Injectable } from '@nestjs/common';
import { CrudService } from './crud.service';
import { InjectModel } from '@nestjs/sequelize';
import { RouteDetail } from '../entities/routeDetail.entity';

@Injectable()
export class RouteDetailService extends CrudService<RouteDetail> {
  constructor(
    @InjectModel(RouteDetail)
    model: typeof RouteDetail,
  ) {
    super(model);
  }
}
