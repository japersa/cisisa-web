import { Company } from '../../domain/entities/company.entity';

export const CompanyProvider = [
  {
    provide: 'CompanyRepository',
    useValue: Company,
  },
];
