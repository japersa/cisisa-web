import { ForgottenPassword } from '../../domain/entities/forgottenpassword.entity';

export const ForgottenPasswordProvider = [
  {
    provide: 'ForgottenPasswordRepository',
    useValue: ForgottenPassword,
  },
];
