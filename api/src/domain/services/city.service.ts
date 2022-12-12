import { Injectable } from '@nestjs/common';
import { CrudService } from './crud.service';
import { InjectModel } from '@nestjs/sequelize';
import { City } from '../entities/city.entity';

@Injectable()
export class CityService extends CrudService<City> {
  constructor(
    @InjectModel(City)
    model: typeof City,
  ) {
    super(model);
  }
}
