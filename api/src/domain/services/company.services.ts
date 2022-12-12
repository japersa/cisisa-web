import { Injectable } from '@nestjs/common';
import { CrudService } from './crud.service';
import { InjectModel } from '@nestjs/sequelize';
import { Company } from '../entities/company.entity';

@Injectable()
export class CompanyService extends CrudService<Company> {
  constructor(
    @InjectModel(Company)
    model: typeof Company,
  ) {
    super(model);
  }
}
