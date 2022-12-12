import { RouteDetail } from '../../domain/entities/routeDetail.entity';

export const RouteDetailProvider = [
  {
    provide: 'RouteDetailRepository',
    useValue: RouteDetail,
  },
];
