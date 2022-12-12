import { Headquarters } from 'src/domain/entities/headquarters.entity';

export const HeadquartersProvider = [
  {
    provide: 'HeadquartersRepository',
    useValue: Headquarters,
  },
];
