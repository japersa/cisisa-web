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
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AreaService } from '../../domain/services/area.service';
import { AreaDto } from '../../domain/dto/area.dto';
import { PaginateOptions } from 'src/domain/services/crud.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginateResponseDto } from 'src/domain/dto/paginated-response.dto';
import { Op, Sequelize } from 'sequelize';
import { City } from 'src/domain/entities/city.entity';

@ApiTags('areas')
@Controller('areas')
export class AreaController {
  constructor(private readonly _service: AreaService) {}

  /**
   *
   * @returns {PaginateResponseDto{}} Returns all areas with theirs pagination
   * @param {PaginateOptions} request
   */
  @ApiOperation({ summary: 'Read all areas' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Areas has been successfully finded.',
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
    const areas = await this._service.paginate({
      page,
      offset,
      order: [['description', 'ASC']],
      where: {
        [Op.and]: [
          search != '' && {
            [Op.or]: [
              {
                idArea: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                description: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                '$city.description$': {
                  [Op.like]: `%${options.search}%`,
                },
              },
            ],
          },
        ],
      },
      include: [
        {
          model: City,
          as: 'city',
        },
      ],
    });
    return res.status(HttpStatus.OK).json(areas);
  }

  /**
   *
   * @returns {AreaDto{}} Returns an area by id
   * @param {id} request
   */
  @ApiOperation({ summary: 'Search an area' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: AreaDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Area doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  public async findOne(@Response() res, @Param() param) {
    const area = await this._service.findOne({
      where: { idArea: param.id },
      include: [
        {
          model: City,
          as: 'city',
        },
      ],
      raw: true,
      nest: true,
    });

    if (area) {
      return res.status(HttpStatus.OK).json(area);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Area doesn't exist!" });
  }

  /**
   *
   * @returns {AreaDto{}} Returns a new area
   * @param {AreaDto} request
   */
  @ApiOperation({ summary: 'Create area' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: AreaDto,
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
    description: 'Area already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(@Response() res, @Body() areaDto: AreaDto) {
    const areaExists = await this._service.findOne({
      where: { description: areaDto.description, idCity: areaDto.idCity },
    });
    if (areaExists) {
      return res
        .status(HttpStatus.FOUND)
        .json({ message: 'Area already exists!' });
    }
    const area = await this._service.create(areaDto);
    return res.status(HttpStatus.OK).json(area);
  }

  /**
   *
   * @returns {AreaDto{}} Returns the modified area
   * @param {id} request
   * @param {AreaDto} request
   */
  @ApiOperation({ summary: 'Change the area state' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record state has been successfully changed.',
    type: AreaDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Area doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/changeState/:id')
  public async changeState(@Param() param, @Response() res, @Body() body) {
    const options = { where: { idArea: param.id } };
    body = { ...body, isActive: !body.isActive };
    const area = await this._service.update(body, options, options);
    if (area) {
      return res.status(HttpStatus.OK).json(area);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Area doesn't exist!" });
  }

  /**
   *
   * @returns {AreaDto{}} Returns a updated area
   * @param {id} request
   * @param {AreaDto} request
   */
  @ApiOperation({ summary: 'Update area' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully updated.',
    type: AreaDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Area doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Area already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  public async update(@Param() param, @Response() res, @Body() body) {
    const areaExists = await this._service.findOne({
      where: { description: body.description, idCity: body.idCity },
    });
    if (areaExists && param.id != areaExists.idArea) {
      return res
        .status(HttpStatus.FOUND)
        .json({ message: 'Area already exists!' });
    }

    const options = { where: { idArea: param.id } };
    const area = await this._service.update(body, options, options);

    if (area) {
      return res.status(HttpStatus.OK).json(area);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Area doesn't exist!" });
  }
}
