import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/domain/entities/user.entity';
import { Permission } from 'src/domain/entities/permission.entity';
import { PermissionRole } from 'src/domain/entities/permission_role.entity';
import { Role } from 'src/domain/entities/role.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: typeof User,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRETORKEY,
    });
  }

  async validate(payload: any) {
    const checkUser = await this.userRepository.findOne({
      where: {
        idUser: payload.subject,
        isActive: true,
      },
      include: [
        {
          model: Role,
          as: 'role',
          include: [
            {
              model: PermissionRole,
              include: [
                {
                  model: Permission,
                },
              ],
            },
          ],
        },
      ],
      nest: true
    });

    if (!checkUser) {
      throw new UnauthorizedException();
    }

    const { ['password']: remove, ...user } = checkUser.dataValues;

    return user;
  }
}
