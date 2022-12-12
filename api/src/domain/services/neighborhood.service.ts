import { Injectable } from '@nestjs/common';
import { CrudService } from './crud.service';
import { InjectModel } from '@nestjs/sequelize';
import { Neighborhood } from '../entities/neighborhood.entity';

@Injectable()
export class NeighborhoodService extends CrudService<Neighborhood> {
  constructor(
    @InjectModel(Neighborhood)
    model: typeof Neighborhood,
  ) {
    super(model);
  }
}
