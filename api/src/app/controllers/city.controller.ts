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
import { CityService } from '../../domain/services/city.service';
import { CityDto } from '../../domain/dto/city.dto';
import { PaginateOptions } from 'src/domain/services/crud.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { City } from 'src/domain/entities/city.entity';
import { PaginateResponseDto } from 'src/domain/dto/paginated-response.dto';
import { Op, Sequelize } from 'sequelize';
import { Department } from 'src/domain/entities/department.entity';
import { Neighborhood } from 'src/domain/entities/neighborhood.entity';

@ApiTags('cities')
@Controller('cities')
export class CityController {
  constructor(private readonly _service: CityService) {}

  /**
   *
   * @returns {PaginateResponseDto{}} Returns all cities with theirs pagination
   * @param {PaginateOptions} request
   */
  @ApiOperation({ summary: 'Read all cities' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cities has been successfully finded.',
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
    const cities = await this._service.paginate({
      page,
      offset,
      order: [['description', 'ASC']],
      where: {
        [Op.and]: [
          search != '' && {
            [Op.or]: [
              {
                idCity: {
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
              Sequelize.where(Sequelize.col('department.description'), {
                [Op.like]: `%${options.search}%`,
              }),
            ],
          },
        ],
      },
      include: [
        {
          model: Department,
          as: 'department',
        },
      ],
    });
    return res.status(HttpStatus.OK).json(cities);
  }

  /**
   *
   * @returns {CityDto{}} Returns all cities by idDepartment
   * @param {id} request
   */
  @ApiOperation({ summary: 'Search cities by department' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: CityDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "City doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/department/:idDepartment')
  public async findAllByDepartment(@Response() res, @Param() param) {
    const cities = await this._service.findAll({
      where: { idDepartment: param.idDepartment },
      raw: true,
      order: [['description', 'ASC']],
    });

    if (cities) {
      return res.status(HttpStatus.OK).json(cities);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "City doesn't exist!" });
  }

  /**
   *
   * @returns {CityDto{}} Returns a city by id
   * @param {id} request
   */
  @ApiOperation({ summary: 'Search a city' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: CityDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "City doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  public async findOne(@Response() res, @Param() param) {
    const city = await this._service.findOne({
      where: { idCity: param.id },
    });

    if (city) {
      return res.status(HttpStatus.OK).json(city);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "City doesn't exist!" });
  }

  /**
   *
   * @returns {CityDto{}} Returns a new city
   * @param {CityDto} request
   */
  @ApiOperation({ summary: 'Create city' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: CityDto,
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
    description: 'City already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(@Response() res, @Body() cityDto: CityDto) {
    cityDto.description = cityDto.description.toUpperCase();
    const cityExists = await this._service.findOne({
      where: {
        description: cityDto.description.toUpperCase(),
        idDepartment: cityDto.idDepartment,
      },
    });
    if (cityExists) {
      return res
        .status(HttpStatus.FOUND)
        .json({ message: 'City already exists!' });
    }
    const city = await this._service.create(cityDto);
    return res.status(HttpStatus.OK).json(city);
  }

  /**
   *
   * @returns {CityDto{}} Returns the modified city
   * @param {id} request
   * @param {CityDto} request
   */
  @ApiOperation({ summary: 'Change the city state' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record state has been successfully changed.',
    type: CityDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "City doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/changeState/:id')
  public async changeState(@Param() param, @Response() res, @Body() body) {
    const options = { where: { idCity: param.id } };
    body = { ...body, isActive: !body.isActive };
    const city = await this._service.update(body, options, options);
    if (city) {
      return res.status(HttpStatus.OK).json(city);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "City doesn't exist!" });
  }

  /**
   *
   * @returns {CityDto{}} Returns a updated city
   * @param {id} request
   * @param {CityDto} request
   */
  @ApiOperation({ summary: 'Update city' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully updated.',
    type: CityDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "City doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'City already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  public async update(@Param() param, @Response() res, @Body() body) {
    body.description = body.description.toUpperCase();
    const cityExists = await this._service.findOne({
      where: {
        description: body.description.toUpperCase(),
        idDepartment: body.idDepartment,
      },
    });
    if (cityExists && param.id != cityExists.idCity) {
      return res
        .status(HttpStatus.FOUND)
        .json({ message: 'City already exists!' });
    }

    const options = { where: { idCity: param.id } };
    const city = await this._service.update(body, options, options);

    if (city) {
      return res.status(HttpStatus.OK).json(city);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "City doesn't exist!" });
  }
}
