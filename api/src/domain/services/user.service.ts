import * as bcrypt from 'bcryptjs';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CrudService, PaginateOptions } from './crud.service';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../entities/user.entity';
import { Op, Sequelize } from 'sequelize';
import { UserDto } from '../dto/user.dto';
import { MailService } from './mail.service';
import { Role } from '../entities/role.entity';
import { Company } from '../entities/company.entity';
import { Headquarters } from '../entities/headquarters.entity';

@Injectable()
export class UserService extends CrudService<User> {
  constructor(
    @InjectModel(User) model: typeof User,
    private readonly mailService: MailService,
  ) {
    super(model);
  }

  async getUsers(options: PaginateOptions, req) {
    const exclude = ['password'];
    const { page, offset, search } = options;
    return await this.paginate({
      ...options,
      where: {
        [Op.and]: [
          req.user.role.idCompany && {
            '$role.idCompany$': {
              [Op.eq]: req.user.role.idCompany,
            },
          },
          search != '' && {
            [Op.or]: [
              {
                idUser: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                firstName: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                secondName: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                lastName: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                secondLastName: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                email: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                documentNumber: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                phone: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              Sequelize.where(Sequelize.col('role.name'), {
                [Op.like]: `%${options.search}%`,
              }),
              Sequelize.where(Sequelize.col('role.company.description'), {
                [Op.like]: `%${options.search}%`,
              }),
              Sequelize.where(Sequelize.col('headquarters.nameHeadquarters'), {
                [Op.like]: `%${options.search}%`,
              }),
            ],
          },
        ],
      },
      include: [
        {
          model: Role,
          as: 'role',
          include: [
            {
              model: Company,
              as: 'company',
            },
          ],
        },
        {
          model: Headquarters,
          as: 'headquarters',
        },
      ],
      attributes: {
        exclude: exclude,
      },
      raw: true,
      nest: true,
    });
  }

  async updateUser(param, body) {
    const options = { where: { idUser: param.id } };
    let params = body;
    if (params.password) {
      const password = await bcrypt.hash(body.password, 10);
      params = { ...params, password: password };
    }
    return await this.update(params, options, options);
  }

  async createUser(createUserDto: UserDto) {
    const checkUniqueEmail = await this.findOne({
      where: { email: createUserDto.email },
    });
    const checkUniquePhone = await this.findOne({
      where: { phone: createUserDto.phone },
    });

    if (checkUniqueEmail) {
      throw new HttpException(
        'This email already exists.',
        HttpStatus.CONFLICT,
      );
    } else if (checkUniquePhone) {
      throw new HttpException(
        'This phone already exists.',
        HttpStatus.CONFLICT,
      );
    } else {
      let user = createUserDto;
      const password = await bcrypt.hash(createUserDto.password, 10);
      user = { ...user, password: password };

      await this.mailService.sendMail({
        to: createUserDto.email,
        subject: 'Welcome!',
        template: 'welcome',
        context: {
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          email: createUserDto.email,
          password: createUserDto.password,
        },
      });

      return await this.create(user);
    }
  }
}
