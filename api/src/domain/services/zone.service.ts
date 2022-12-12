import { Injectable } from '@nestjs/common';
import { CrudService } from './crud.service';
import { InjectModel } from '@nestjs/sequelize';
import { Zone } from '../entities/zone.entity';

@Injectable()
export class ZoneService extends CrudService<Zone> {
  constructor(
    @InjectModel(Zone)
    model: typeof Zone,
  ) {
    super(model);
  }
}
