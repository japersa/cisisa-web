import { Injectable } from '@nestjs/common';
import { CrudService } from './crud.service';
import { InjectModel } from '@nestjs/sequelize';
import { Route } from '../entities/route.entity';

@Injectable()
export class RouteService extends CrudService<Route> {
  constructor(
    @InjectModel(Route)
    model: typeof Route,
  ) {
    super(model);
  }
}
