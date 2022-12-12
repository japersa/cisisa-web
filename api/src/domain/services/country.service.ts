import { Injectable, Inject } from '@nestjs/common';
import { CrudService } from './crud.service';
import { InjectModel } from '@nestjs/sequelize';
import { Country } from '../entities/country.entity';

@Injectable()
export class CountryService extends CrudService<Country> {
  constructor(
    @InjectModel(Country)
    model: typeof Country,
  ) {
    super(model);
  }
}
