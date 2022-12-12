import { Prb } from '../../domain/entities/prb.entity';

export const PrbProvider = [
  {
    provide: 'PrbRepository',
    useValue: Prb,
  },
];
