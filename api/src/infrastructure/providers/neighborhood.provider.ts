import { Neighborhood } from '../../domain/entities/neighborhood.entity';

export const NeighborhoodProvider = [
  {
    provide: 'NeighborhoodRepository',
    useValue: Neighborhood,
  },
];
