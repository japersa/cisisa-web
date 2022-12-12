import { Injectable } from '@nestjs/common';
import { CrudService } from './crud.service';
import { InjectModel } from '@nestjs/sequelize';
import { Address } from '../entities/address.entity';

@Injectable()
export class AddressService extends CrudService<Address> {
  constructor(
    @InjectModel(Address)
    model: typeof Address,
  ) {
    super(model);
  }
}
