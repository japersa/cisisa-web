import { Area } from '../../domain/entities/area.entity';

export const AreaProvider = [
  {
    provide: 'AreaRepository',
    useValue: Area,
  },
];
