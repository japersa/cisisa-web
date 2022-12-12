import { ZoneNeighborhood } from '../../domain/entities/zone_neighborhood.entity';

export const ZoneNeighborhoodProvider = [
  {
    provide: 'ZoneNeighborhoodRepository',
    useValue: ZoneNeighborhood,
  },
];
