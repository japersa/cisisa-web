import { Injectable } from '@nestjs/common';
import { CrudService } from './crud.service';
import { InjectModel } from '@nestjs/sequelize';
import { RouteObservation } from '../entities/routeObservation.entity';

@Injectable()
export class RouteObservationService extends CrudService<RouteObservation> {
  constructor(
    @InjectModel(RouteObservation)
    model: typeof RouteObservation,
  ) {
    super(model);
  }
}
