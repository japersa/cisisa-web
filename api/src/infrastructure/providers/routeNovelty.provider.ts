import { RouteNovelty } from 'src/domain/entities/routeNovelty.entity';

export const RouteNoveltyProvider = [
  {
    provide: 'RouteNoveltyRepository',
    useValue: RouteNovelty,
  },
];
