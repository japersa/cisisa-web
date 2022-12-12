import { Department } from '../../domain/entities/department.entity';

export const DepartmentProvider = [
  {
    provide: 'DepartmentRepository',
    useValue: Department,
  },
];
