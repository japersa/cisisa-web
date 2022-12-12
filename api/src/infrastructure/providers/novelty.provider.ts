import { Novelty } from 'src/domain/entities/novelty.entity';

export const NoveltyProvider = [
  {
    provide: 'NoveltyRepository',
    useValue: Novelty,
  },
];
