import { Address } from '../../domain/entities/address.entity';

export const AddressProvider = [
  {
    provide: 'AddressRepository',
    useValue: Address,
  },
];
