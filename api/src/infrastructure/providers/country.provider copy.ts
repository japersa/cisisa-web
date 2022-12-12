import { Country } from '../../domain/entities/country.entity';

export const CountryProvider = [
  {
    provide: 'CountryRepository',
    useValue: Country,
  },
];
