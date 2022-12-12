import { User } from '../../domain/entities/user.entity';

export const UserProvider = [
  {
    provide: 'UserRepository',
    useValue: User,
  },
];
