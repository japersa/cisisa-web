import { Injectable } from '@nestjs/common';
import { CrudService } from './crud.service';
import { InjectModel } from '@nestjs/sequelize';
import { Headquarters } from '../entities/headquarters.entity';

@Injectable()
export class HeadquartersService extends CrudService<Headquarters> {
  constructor(
    @InjectModel(Headquarters)
    model: typeof Headquarters,
  ) {
    super(model);
  }
}
