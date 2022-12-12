import { RefreshToken } from '../../domain/entities/refreshToken.entity';

export const RefreshTokenProvider = [
  {
    provide: 'RefreshTokenRepository',
    useValue: RefreshToken,
  },
];
