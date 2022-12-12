import { AddressesEvent } from 'src/domain/entities/addressesEvent';

export const AddressesEventProvider = [
  {
    provide: 'AddressesEventRepository',
    useValue: AddressesEvent,
  },
];
