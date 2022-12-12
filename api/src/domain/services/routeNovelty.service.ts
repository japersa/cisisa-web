import { Injectable } from '@nestjs/common';
import { CrudService } from './crud.service';
import { InjectModel } from '@nestjs/sequelize';
import { RouteNovelty } from '../entities/routeNovelty.entity';

@Injectable()
export class RouteNoveltyService extends CrudService<RouteNovelty> {
  constructor(
    @InjectModel(RouteNovelty)
    model: typeof RouteNovelty,
  ) {
    super(model);
  }
}
