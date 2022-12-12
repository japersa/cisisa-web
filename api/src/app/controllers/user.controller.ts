import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Response,
  UseGuards,
  Request,
  Inject,
} from '@nestjs/common';
import { UserDto } from '../../domain/dto/user.dto';
import { UserService } from '../../domain/services/user.service';
import { PaginateOptions } from 'src/domain/services/crud.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginateResponseDto } from 'src/domain/dto/paginated-response.dto';
import { User } from 'src/domain/entities/user.entity';
import { Role } from 'src/domain/entities/role.entity';
import { Op, Sequelize, QueryTypes } from 'sequelize';
import { Company } from 'src/domain/entities/company.entity';
import * as bcrypt from 'bcryptjs';
import { PermissionRole } from 'src/domain/entities/permission_role.entity';
import { Permission } from 'src/domain/entities/permission.entity';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly _service: UserService,
    @Inject('DATABASE_CONNECTION') private readonly sequelize,
  ) {}

  async getQuery(query, params) {
    return await this.sequelize.query(query, {
      replacements: params,
      logging: console.log,
      plain: false,
      type: QueryTypes.SELECT,
    });
  }
  /**
   *
   * @returns {PaginateResponseDto{}} Returns all users with theirs pagination
   * @param {PaginateOptions} request
   */
  @ApiOperation({ summary: 'Read all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users has been successfully finded.',
    type: PaginateResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/couriers')
  public async findAllCouriers(
    @Response() res,
    @Query() options: PaginateOptions,
    @Request() req,
  ) {
    const sqlRoute = `SELECT U.*, H.nameHeadquarters
    FROM TBL_MTR_USER U
      INNER JOIN TBL_MTR_ROLE R ON U.idRole = R.idRole
      INNER JOIN TBL_MTR_PERMISSION_ROLE PR ON U.idRole = PR.idRole
      INNER JOIN TBL_MTR_PERMISSION P ON PR.idPermission = P.idPermission
      LEFT OUTER JOIN TBL_MTR_HEADQUARTERS H ON U.idHeadquarters = H.idHeadquarters 
    WHERE P.name = :permission AND (:company IS NULL OR R.idCompany = :company);`;
    const params = {
      company: req.user.role.idCompany,
      permission: 'feature:courier',
    };
    const result = await this.getQuery(sqlRoute, params);

    return res.status(HttpStatus.OK).json(result);
  }

  /**
   *
   * @returns {PaginateResponseDto{}} Returns all users with theirs pagination
   * @param {PaginateOptions} request
   */
  @ApiOperation({ summary: 'Read all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users has been successfully finded.',
    type: PaginateResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  public async findAll(
    @Response() res,
    @Query() options: PaginateOptions,
    @Request() req,
  ) {
    options.where = {
      [Op.and]: [
        req.user.role.idCompany && {
          idCompany: {
            [Op.eq]: req.user.role.idCompany,
          },
        },
      ],
    };
    const users = await this._service.getUsers(options, req);
    return res.status(HttpStatus.OK).json(users);
  }

  /**
   *
   * @returns {User{}} Returns an user by id
   * @param {id} request
   */
  @ApiOperation({ summary: 'Search an user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  public async findOne(@Response() res, @Param() param) {
    const user = await this._service.findOne({
      where: { idUser: param.id },
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
      ],
    });

    if (user) {
      return res.status(HttpStatus.OK).json(user);
    }
    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: 'User does not exist' });
  }

  /**
   *
   * @returns {User{}} Returns a new user
   * @param {UserDto} request
   */
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'User already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(@Response() res, @Body() createUserDto: UserDto) {
    const userExists = await this._service.findOne({
      where: { documentNumber: createUserDto.documentNumber },
    });
    if (userExists) {
      return res
        .status(HttpStatus.FOUND)
        .json({ message: 'User already exists!' });
    }
    const user = await this._service.createUser(createUserDto);
    return res.status(HttpStatus.OK).json(user);
  }

  /**
   *
   * @returns {User{}} Returns a updated user
   * @param {id} request
   * @param {User} request
   */
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully updated.',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'User already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  public async update(@Param() param, @Response() res, @Body() body) {
    const userExists = await this._service.findOne({
      where: { documentNumber: body.documentNumber },
    });
    if (userExists && param.id != userExists.idUser) {
      return res
        .status(HttpStatus.FOUND)
        .json({ message: 'User already exists!' });
    }
    // let params = body;

    // if (body.password) {
    //   const password = await bcrypt.hash(body.password, 10);
    //   params = { ...params, password: password };
    // } else {
    //   params = { ...params, password: userExists.password };
    // }
    // const user = await this._service.updateUser(param, params);
    const user = await this._service.updateUser(param, body);
    if (user) {
      return res.status(HttpStatus.OK).json(user);
    }
    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: 'User does not exist' });
  }

  /**
   *
   * @returns {UserDto{}} Returns the modified role
   * @param {id} request
   * @param {UserDto} request
   */
  @ApiOperation({ summary: 'Change the user state' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record state has been successfully changed.',
    type: UserDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/changeState/:id')
  public async changeState(@Param() param, @Response() res, @Body() body) {
    const options = { where: { idUser: param.id } };
    body = { ...body, isActive: !body.isActive };
    const user = await this._service.update(body, options, options);
    if (user) {
      return res.status(HttpStatus.OK).json(user);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "User doesn't exist!" });
  }
}
