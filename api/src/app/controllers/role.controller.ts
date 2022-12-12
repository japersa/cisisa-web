import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Response,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RoleService } from '../../domain/services/role.service';
import { RoleDto } from '../../domain/dto/role.dto';
import { PaginateOptions } from 'src/domain/services/crud.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginateResponseDto } from 'src/domain/dto/paginated-response.dto';
import { Role } from 'src/domain/entities/role.entity';
import { Op, Sequelize } from 'sequelize';
import { PermissionRole } from 'src/domain/entities/permission_role.entity';
import { PermissionRoleService } from 'src/domain/services/permission_role.service';
import { Company } from 'src/domain/entities/company.entity';

@ApiTags('roles')
@Controller('roles')
export class RoleController {
  constructor(
    private readonly _service: RoleService,
    private readonly _servicePermissionRole: PermissionRoleService,
  ) {}

  /**
   *
   * @returns {PaginateResponseDto{}} Returns all roles with theirs pagination
   * @param {PaginateOptions} request
   */
  @ApiOperation({ summary: 'Read all roles' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Roles has been successfully finded.',
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
    const { page, offset, search } = options;
    const roles = await this._service.paginate({
      page,
      offset,
      order: [['description', 'ASC']],
      where: {
        [Op.and]: [
          search != '' && {
            [Op.or]: [
              {
                idRole: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                description: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                name: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              Sequelize.where(Sequelize.col('company.description'), {
                [Op.like]: `%${options.search}%`,
              }),
            ],
          },
          req.user.role.idCompany && {
            idCompany: {
              [Op.eq]: req.user.role.idCompany,
            },
          },
        ],
      },
      include: [
        {
          model: Company,
          as: 'company',
        },
      ],
    });
    return res.status(HttpStatus.OK).json(roles);
  }

  /**
   *
   * @returns {Role{}} Returns a role by id
   * @param {id} request
   */
  @ApiOperation({ summary: 'Search a role' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: Role,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Role doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  public async findOne(@Response() res, @Param() param) {
    let role = await this._service.findOne({
      where: { idRole: param.id },
      include: [
        {
          model: Company,
          as: 'company',
        },
      ],
      raw: true,
      nest: true,
    });

    let objRole = {
      idRole: 0,
      name: '',
      description: '',
      isActive: true,
      idCompany: 0,
      permissions: [],
    };
    if (role) {
      const permissionsRoles = await this._servicePermissionRole.findAll({
        where: { idRole: role.idRole },
        raw: true,
      });
      const permissions = permissionsRoles.map((permssionrole) =>
        String(permssionrole.idPermission),
      );
      objRole = {
        ...objRole,
        idRole: role.idRole,
        name: role.name,
        description: role.description,
        isActive: role.isActive,
        idCompany: role.idCompany,
      };
      objRole = { ...objRole, permissions: permissions };
      return res.status(HttpStatus.OK).json(objRole);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Role doesn't exist!" });
  }

  /**
   *
   * @returns {Role{}} Returns a new role
   * @param {RoleDto} request
   */
  @ApiOperation({ summary: 'Create role' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: Role,
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
    description: 'Role already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(@Response() res, @Body() roleDto: RoleDto) {
    const roleExists = await this._service.findOne({
      where: { name: roleDto.name },
    });
    if (roleExists) {
      return res
        .status(HttpStatus.FOUND)
        .json({ message: 'Role already exists!' });
    }
    const role = await this._service.create(roleDto);
    const roleCreated = await this._service.findOne({
      where: { idRole: role['dataValues'].idRole },
      raw: true,
      order: [['idRole', 'DESC']],
      limit: 1,
    });
    if (roleDto.multiselectRef.length > 0) {
      for (let index = 0; index < roleDto.multiselectRef.length; index++) {
        const element = roleDto.multiselectRef[index];
        const permissionRoleExists = await this._servicePermissionRole.findAll({
          where: {
            idRole: roleCreated.idRole,
            idPermission: Number(element.idPermission),
          },
          raw: true,
        });
        if (permissionRoleExists.length == 0) {
          const objDto = {
            idRole: roleCreated.idRole,
            idPermission: Number(element.idPermission),
          };
          await this._servicePermissionRole.create(objDto);
        }
      }
      return res.status(HttpStatus.OK).json(role);
    } else {
      return res.status(HttpStatus.OK).json(role);
    }
  }

  /**
   *
   * @returns {RoleDto{}} Returns the modified role
   * @param {id} request
   * @param {RoleDto} request
   */
  @ApiOperation({ summary: 'Change the role state' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record state has been successfully changed.',
    type: RoleDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Role doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/changeState/:id')
  public async changeState(@Param() param, @Response() res, @Body() body) {
    const options = { where: { idRole: param.id } };
    body = { ...body, isActive: !body.isActive };
    const role = await this._service.update(body, options, options);
    if (role) {
      return res.status(HttpStatus.OK).json(role);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Role doesn't exist!" });
  }

  /**
   *
   * @returns {Role{}} Returns a updated role
   * @param {id} request
   * @param {Role} request
   */
  @ApiOperation({ summary: 'Update role' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully updated.',
    type: Role,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Role doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Role already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  public async update(@Param() param, @Response() res, @Body() body) {
    const roleExists = await this._service.findOne({
      where: { name: body.name },
    });
    if (roleExists && param.id != roleExists.idRole) {
      return res
        .status(HttpStatus.FOUND)
        .json({ message: 'Role already exists!' });
    }

    const options = { where: { idRole: param.id } };
    const roleUpdated = await this._service.update(body, options, options);

    if (roleUpdated) {
      await this._servicePermissionRole.deleteByRole(roleUpdated.idRole);

      if (body.multiselectRef.length > 0) {
        for (let index = 0; index < body.multiselectRef.length; index++) {
          const element = body.multiselectRef[index];
          const permissionRoleExists = await this._servicePermissionRole.findAll(
            {
              where: {
                idRole: roleUpdated.idRole,
                idPermission: Number(element.idPermission),
              },
              raw: true,
            },
          );
          if (permissionRoleExists.length == 0) {
            const objDto = {
              idRole: roleUpdated.idRole,
              idPermission: Number(element.idPermission),
            };
            await this._servicePermissionRole.create(objDto);
          }
        }
        return res.status(HttpStatus.OK).json(roleUpdated);
      } else {
        return res.status(HttpStatus.OK).json(roleUpdated);
      }
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Role doesn't exist!" });
  }
}
