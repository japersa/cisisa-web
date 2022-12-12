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
} from '@nestjs/common';
import { PermissionService } from '../../domain/services/permission.service';
import { PermissionDto } from '../../domain/dto/permission.dto';
import { PaginateOptions } from 'src/domain/services/crud.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginateResponseDto } from 'src/domain/dto/paginated-response.dto';
import { Permission } from 'src/domain/entities/permission.entity';
import { Op, Sequelize } from 'sequelize';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionController {
  constructor(private readonly _service: PermissionService) {}

  /**
   *
   * @returns {PaginateResponseDto{}} Returns all permissions with theirs pagination
   * @param {PaginateOptions} request
   */
  @ApiOperation({ summary: 'Read all permissions' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permissions has been successfully finded.',
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
  public async findAll(@Response() res, @Query() options: PaginateOptions) {
    const { page, offset, search } = options;
    const permissions = await this._service.paginate({
      page,
      offset,
      order: [['description', 'ASC']],
      where: {
        [Op.and]: [
          search != '' && {
            [Op.or]: [
              {
                idPermission: {
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
            ],
          },
        ],
      },
    });
    return res.status(HttpStatus.OK).json(permissions);
  }

  /**
   *
   * @returns {Permission{}} Returns a permission by id
   * @param {id} request
   */
  @ApiOperation({ summary: 'Search a permission' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: Permission,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Permission doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  public async findOne(@Response() res, @Param() param) {
    const permission = await this._service.findOne({
      where: { idPermission: param.id },
    });

    if (permission) {
      return res.status(HttpStatus.OK).json(permission);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Permission doesn't exist!" });
  }

  /**
   *
   * @returns {Permission{}} Returns a new permission
   * @param {PermissionDto} request
   */
  @ApiOperation({ summary: 'Create permission' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: Permission,
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
    description: 'Permission already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(@Response() res, @Body() permissionDto: PermissionDto) {
    const permissionExists = await this._service.findOne({
      where: { name: permissionDto.name },
    });
    if (permissionExists) {
      return res
        .status(HttpStatus.FOUND)
        .json({ message: 'Permission already exists!' });
    }
    const permission = await this._service.create(permissionDto);
    return res.status(HttpStatus.OK).json(permission);
  }

  /**
   *
   * @returns {PermissionDto{}} Returns the modified country
   * @param {id} request
   * @param {PermissionDto} request
   */
  @ApiOperation({ summary: 'Change the country state' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record state has been successfully changed.',
    type: PermissionDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Permission doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/changeState/:id')
  public async changeState(@Param() param, @Response() res, @Body() body) {
    const options = { where: { idPermission: param.id } };
    body = { ...body, isActive: !body.isActive };
    const permission = await this._service.update(body, options, options);
    if (permission) {
      return res.status(HttpStatus.OK).json(permission);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Permission doesn't exist!" });
  }

  /**
   *
   * @returns {Permission{}} Returns a updated permission
   * @param {id} request
   * @param {Permission} request
   */
  @ApiOperation({ summary: 'Update permission' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully updated.',
    type: Permission,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Permission doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Permission already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  public async update(@Param() param, @Response() res, @Body() body) {
    const permissionExists = await this._service.findOne({
      where: { name: body.name },
    });
    if (permissionExists && param.id != permissionExists.idPermission) {
      return res
        .status(HttpStatus.FOUND)
        .json({ message: 'Permission already exists!' });
    }

    const options = { where: { idPermission: param.id } };
    const permission = await this._service.update(body, options, options);

    if (permission) {
      return res.status(HttpStatus.OK).json(permission);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Permission doesn't exist!" });
  }
}
