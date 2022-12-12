import { Route } from '../../domain/entities/route.entity';

export const RouteProvider = [
  {
    provide: 'RouteRepository',
    useValue: Route,
  },
];
