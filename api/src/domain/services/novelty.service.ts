import { Injectable } from '@nestjs/common';
import { CrudService } from './crud.service';
import { InjectModel } from '@nestjs/sequelize';
import { Novelty } from '../entities/novelty.entity';

@Injectable()
export class NoveltyService extends CrudService<Novelty> {
  constructor(
    @InjectModel(Novelty)
    model: typeof Novelty,
  ) {
    super(model);
  }
}
