import { City } from '../../domain/entities/city.entity';

export const CityProvider = [
  {
    provide: 'CityRepository',
    useValue: City,
  },
];
