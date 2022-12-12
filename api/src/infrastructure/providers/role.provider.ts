import { Role } from '../../domain/entities/role.entity';

export const RoleProvider = [
  {
    provide: 'RoleRepository',
    useValue: Role,
  },
];
