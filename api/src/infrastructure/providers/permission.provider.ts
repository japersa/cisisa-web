import { Permission } from '../../domain/entities/permission.entity';

export const PermissionProvider = [
  {
    provide: 'PermissionRepository',
    useValue: Permission,
  },
];
