import { RouteObservation } from '../../domain/entities/routeObservation.entity';

export const RouteObservationProvider = [
  {
    provide: 'RouteObservationRepository',
    useValue: RouteObservation,
  },
];
