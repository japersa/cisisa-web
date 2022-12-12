import * as jwt from 'jsonwebtoken';
import { TokenExpiredError } from 'jsonwebtoken';
import { Inject, Injectable, UnprocessableEntityException, } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from '../entities/refreshToken.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class JWTService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('RefreshTokenRepository')
    private readonly refreshTokenRepository: typeof RefreshToken,
    @Inject('UserRepository')
    private readonly userRepository: typeof User,
  ) {
  }

  async createAccessTokenAndRefreshToken(user) {
    const expiresIn = this.configService.get<string>(`jwt.expiresIn`),
      refreshTokenExpiresIn = this.configService.get<string>(
        `jwt.refreshTokenExpiresIn`,
      ),
      secretOrKey = this.configService.get<string>(`jwt.secretOrKey`),
      type = this.configService.get<string>(`jwt.type`);

    const accessToken = await this.generateAccessToken(
      user,
      secretOrKey,
      expiresIn,
    );
    const refreshToken = await this.generateRefreshToken(
      user,
      secretOrKey,
      refreshTokenExpiresIn,
    );
    return {
      type,
      accessToken,
      refreshToken,
    };
  }

  public async generateAccessToken(
    user: User,
    secretOrKey: string,
    expiresIn: string,
  ): Promise<string> {
    return jwt.sign(
      {
        subject: String(user.idUser),
      },
      secretOrKey,
      { expiresIn },
    );
  }

  public async createRefreshToken(
    user: User,
    ttl: string,
  ): Promise<RefreshToken> {
    const token = new RefreshToken();

    token.idUser = user.idUser;
    token.isRevoked = false;

    const expiration = new Date();
    expiration.setTime(expiration.getTime() + Number(ttl));

    token.expires = expiration;

    return token.save();
  }

  public async generateRefreshToken(
    user: User,
    secretOrKey: string,
    expiresIn: string,
  ): Promise<string> {
    const token = await this.createRefreshToken(user, expiresIn);
    return jwt.sign(
      {
        subject: String(user.idUser),
        jwtId: String(token.id),
      },
      secretOrKey,
      { expiresIn },
    );
  }

  public async resolveRefreshToken(
    encoded: string,
  ): Promise<{ user: User; token: RefreshToken }> {
    const payload = await this.decodeRefreshToken(encoded);
    const token = await this.getStoredTokenFromRefreshTokenPayload(payload);

    if (!token) {
      throw new UnprocessableEntityException('Refresh token not found');
    }

    if (token.isRevoked) {
      throw new UnprocessableEntityException('Refresh token revoked');
    }

    const user = await this.getUserFromRefreshTokenPayload(payload);

    if (!user) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    await this.refreshTokenRepository.destroy({ where: { id: token.id } });

    return { user, token };
  }

  public async createAccessTokenFromRefreshToken(refresh: string) {
    const { user } = await this.resolveRefreshToken(refresh);
    const payload = await this.createAccessTokenAndRefreshToken(user);
    return { user, payload };
  }

  private async decodeRefreshToken(token: string) {
    try {
      const secretOrKey = this.configService.get<string>(`jwt.secretOrKey`);
      return jwt.verify(token, secretOrKey);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException('Refresh token expired');
      } else {
        throw new UnprocessableEntityException('Refresh token malformed');
      }
    }
  }

  private async getUserFromRefreshTokenPayload(payload: any): Promise<User> {
    const subject = payload.subject;

    if (!subject) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return this.userRepository.findOne({
      where: {
        idUser: subject
      }
    });
  }

  private async getStoredTokenFromRefreshTokenPayload(
    payload: any,
  ): Promise<RefreshToken | null> {
    const tokenId = payload.jwtId;

    if (!tokenId) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return this.refreshTokenRepository.findOne({
      where: {
        id: tokenId
      }
    });
  }
}
