import { Injectable } from '@nestjs/common';
import { CrudService } from './crud.service';
import { InjectModel } from '@nestjs/sequelize';
import { AddressesEvent } from '../entities/addressesEvent';

@Injectable()
export class AddressesEventService extends CrudService<AddressesEvent> {
  constructor(
    @InjectModel(AddressesEvent)
    model: typeof AddressesEvent,
  ) {
    super(model);
  }
}
