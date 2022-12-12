import { PermissionRole } from '../../domain/entities/permission_role.entity';

export const PermissionRoleProvider = [
  {
    provide: 'PermissionRoleRepository',
    useValue: PermissionRole,
  },
];
