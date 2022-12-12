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
import { DepartmentService } from '../../domain/services/department.service';
import { DepartmentDto } from '../../domain/dto/department.dto';
import { PaginateOptions } from 'src/domain/services/crud.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Department } from 'src/domain/entities/department.entity';
import { PaginateResponseDto } from 'src/domain/dto/paginated-response.dto';
import { Op, Sequelize } from 'sequelize';
import { Country } from 'src/domain/entities/country.entity';

@ApiTags('departments')
@Controller('departments')
export class DepartmentController {
  constructor(private readonly _service: DepartmentService) {}

  /**
   *
   * @returns {PaginateResponseDto{}} Returns all departments with theirs pagination
   * @param {PaginateOptions} request
   */
  @ApiOperation({ summary: 'Read all departments' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Departments has been successfully finded.',
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
    const departments = await this._service.paginate({
      page,
      offset,
      order: [['description', 'ASC']],
      where: {
        [Op.and]: [
          search != '' && {
            [Op.or]: [
              {
                idDepartment: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                description: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                code: {
                  [Op.like]: `%${options.search}%`,
                },
              },
            ],
          },
        ],
      },
      include: [
        {
          model: Country,
          as: 'country',
        },
      ],
    });
    return res.status(HttpStatus.OK).json(departments);
  }

  /**
   *
   * @returns {DepartmentDto{}} Returns all departments by idCountry
   * @param {id} request
   */
  @ApiOperation({ summary: 'Search departments by counttry' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: DepartmentDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Department doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/country/:idCountry')
  public async findAllByCountry(@Response() res, @Param() param) {
    const departments = await this._service.findAll({
      where: { idCountry: param.idCountry },
      raw: true,
      order: [['description', 'ASC']],
    });

    if (departments) {
      return res.status(HttpStatus.OK).json(departments);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Department doesn't exist!" });
  }

  /**
   *
   * @returns {DepartmentDto{}} Returns a department by id
   * @param {id} request
   */
  @ApiOperation({ summary: 'Search a department' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: DepartmentDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Department doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  public async findOne(@Response() res, @Param() param) {
    const department = await this._service.findOne({
      where: { idDepartment: param.id },
    });

    if (department) {
      return res.status(HttpStatus.OK).json(department);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Department doesn't exist!" });
  }

  /**
   *
   * @returns {DepartmentDto{}} Returns a new department
   * @param {DepartmentDto} request
   */
  @ApiOperation({ summary: 'Create department' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: DepartmentDto,
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
    description: 'Department already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(@Response() res, @Body() departmentDto: DepartmentDto) {
    departmentDto.description = departmentDto.description.toUpperCase();
    const departmentExists = await this._service.findOne({
      where: { description: departmentDto.description.toUpperCase() },
    });
    if (departmentExists) {
      return res
        .status(HttpStatus.FOUND)
        .json({ message: 'Department already exists!' });
    }

    const department = await this._service.create(departmentDto);
    if (department) {
      return res.status(HttpStatus.OK).json(department);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Department doesn't exist!" });
  }

  /**
   *
   * @returns {DepartmentDto{}} Returns the modified department
   * @param {id} request
   * @param {DepartmentDto} request
   */
  @ApiOperation({ summary: 'Change the department state' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record state has been successfully changed.',
    type: DepartmentDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Department doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/changeState/:id')
  public async changeState(@Param() param, @Response() res, @Body() body) {
    const options = { where: { idDepartment: param.id } };
    body = { ...body, isActive: !body.isActive };
    const department = await this._service.update(body, options, options);
    if (department) {
      return res.status(HttpStatus.OK).json(department);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Department doesn't exist!" });
  }

  /**
   *
   * @returns {DepartmentDto{}} Returns a updated department
   * @param {id} request
   * @param {DepartmentDto} request
   */
  @ApiOperation({ summary: 'Update department' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully updated.',
    type: DepartmentDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Department doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Department already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  public async update(@Param() param, @Response() res, @Body() body) {
    body.description = body.description.toUpperCase();
    const departmentExists = await this._service.findOne({
      where: { description: body.description.toUpperCase() },
    });
    if (departmentExists && param.id != departmentExists.idDepartment) {
      return res
        .status(HttpStatus.FOUND)
        .json({ message: 'Department already exists!' });
    }

    const options = { where: { idDepartment: param.id } };
    const department = await this._service.update(body, options, options);

    if (department) {
      return res.status(HttpStatus.OK).json(department);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Department doesn't exist!" });
  }
}
