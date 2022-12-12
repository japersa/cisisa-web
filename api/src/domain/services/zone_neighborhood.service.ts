import { Injectable } from '@nestjs/common';
import { CrudService } from './crud.service';
import { InjectModel } from '@nestjs/sequelize';
import { ZoneNeighborhood } from '../entities/zone_neighborhood.entity';

@Injectable()
export class ZoneNeighborhoodService extends CrudService<ZoneNeighborhood> {
  constructor(
    @InjectModel(ZoneNeighborhood)
    model: typeof ZoneNeighborhood,
  ) {
    super(model);
  }
}
