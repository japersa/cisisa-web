import { Zone } from '../../domain/entities/zone.entity';

export const ZoneProvider = [
  {
    provide: 'ZoneRepository',
    useValue: Zone,
  },
];
