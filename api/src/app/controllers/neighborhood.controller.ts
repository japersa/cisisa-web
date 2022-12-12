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
import { NeighborhoodService } from '../../domain/services/neighborhood.service';
import { NeighborhoodDto } from '../../domain/dto/neighborhood.dto';
import { PaginateOptions } from 'src/domain/services/crud.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginateResponseDto } from 'src/domain/dto/paginated-response.dto';
import { Op, Sequelize } from 'sequelize';
import { City } from 'src/domain/entities/city.entity';
import { ZoneService } from 'src/domain/services/zone.service';

@ApiTags('neighborhoods')
@Controller('neighborhoods')
export class NeighborhoodController {
  constructor(
    private readonly _service: NeighborhoodService,
    private readonly _serviceZone: ZoneService,
  ) {}

  /**
   *
   * @returns {PaginateResponseDto{}} Returns all neighborhoods with theirs pagination
   * @param {PaginateOptions} request
   */
  @ApiOperation({ summary: 'Read all neighborhoods' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Neighborhoods has been successfully finded.',
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
    const neighborhoods = await this._service.paginate({
      page,
      offset,
      order: [['description', 'ASC']],
      where: {
        [Op.and]: [
          search != '' && {
            [Op.or]: [
              {
                idNeighborhood: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                description: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                lat: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                lan: {
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
    return res.status(HttpStatus.OK).json(neighborhoods);
  }

  /**
   *
   * @returns {NeighborhoodDto{}} Returns all neighborhoods by idCity
   * @param {id} request
   */
  @ApiOperation({ summary: 'Search a neighborhoods by city' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: NeighborhoodDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Neighborhood doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/city/:idCity')
  public async findAllByCity(@Response() res, @Param() param) {
    const neighborhoods = await this._service.findAll({
      where: { idCity: param.idCity },
      include: [
        {
          model: City,
          as: 'city',
        },
      ],
      raw: true,
      nest: true,
      order: [['description', 'ASC']],
    });

    if (neighborhoods) {
      return res.status(HttpStatus.OK).json(neighborhoods);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Neighborhood doesn't exist!" });
  }

  /**
   *
   * @returns {NeighborhoodDto{}} Returns all neighborhoods by idZone
   * @param {id} request
   */
  @ApiOperation({ summary: 'Search a neighborhoods by zone' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: NeighborhoodDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Neighborhood doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/zone/:idZone')
  public async findAllByZone(@Response() res, @Param() param) {
    const zoneSelected = await this._serviceZone.findOne({
      where: { idZone: param.idZone },
      raw: true,
    });

    const neighborhoods = await this._service.findAll({
      where: { idCity: zoneSelected.idCity },
      include: [
        {
          model: City,
          as: 'city',
        },
      ],
      raw: true,
      nest: true,
      order: [['description', 'ASC']],
    });

    if (neighborhoods) {
      return res.status(HttpStatus.OK).json(neighborhoods);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Neighborhood doesn't exist!" });
  }

  /**
   *
   * @returns {NeighborhoodDto{}} Returns a neighborhood by id
   * @param {id} request
   */
  @ApiOperation({ summary: 'Search a neighborhood' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: NeighborhoodDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Neighborhood doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  public async findOne(@Response() res, @Param() param) {
    const neighborhood = await this._service.findOne({
      where: { idNeighborhood: param.id },
      include: [
        {
          model: City,
          as: 'city',
        },
      ],
      raw: true,
      nest: true,
    });

    if (neighborhood) {
      return res.status(HttpStatus.OK).json(neighborhood);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Neighborhood doesn't exist!" });
  }

  /**
   *
   * @returns {NeighborhoodDto{}} Returns a new neighborhood
   * @param {NeighborhoodDto} request
   */
  @ApiOperation({ summary: 'Create neighborhood' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: NeighborhoodDto,
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
    description: 'Neighborhood already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(
    @Response() res,
    @Body() neighborhoodDto: NeighborhoodDto,
  ) {
    neighborhoodDto.description = neighborhoodDto.description.toUpperCase();
    const neighborhoodExists = await this._service.findOne({
      where: {
        description: neighborhoodDto.description.toUpperCase(),
        idCity: neighborhoodDto.idCity,
      },
    });
    if (neighborhoodExists) {
      return res
        .status(HttpStatus.FOUND)
        .json({ message: 'Neighborhood already exists!' });
    }
    const neighborhood = await this._service.create(neighborhoodDto);
    return res.status(HttpStatus.OK).json(neighborhood);
  }

  /**
   *
   * @returns {NeighborhoodDto{}} Returns the modified neighborhood
   * @param {id} request
   * @param {NeighborhoodDto} request
   */
  @ApiOperation({ summary: 'Change the neighborhood state' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record state has been successfully changed.',
    type: NeighborhoodDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Neighborhood doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/changeState/:id')
  public async changeState(@Param() param, @Response() res, @Body() body) {
    const options = { where: { idNeighborhood: param.id } };
    body = { ...body, isActive: !body.isActive };
    const neighborhood = await this._service.update(body, options, options);
    if (neighborhood) {
      return res.status(HttpStatus.OK).json(neighborhood);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Neighborhood doesn't exist!" });
  }

  /**
   *
   * @returns {NeighborhoodDto{}} Returns a updated neighborhood
   * @param {id} request
   * @param {NeighborhoodDto} request
   */
  @ApiOperation({ summary: 'Update neighborhood' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully updated.',
    type: NeighborhoodDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Neighborhood doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Neighborhood already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  public async update(@Param() param, @Response() res, @Body() body) {
    body.description = body.description.toUpperCase();
    const neighborhoodExists = await this._service.findOne({
      where: {
        description: body.description.toUpperCase(),
        idCity: body.idCity,
      },
    });
    if (neighborhoodExists && param.id != neighborhoodExists.idNeighborhood) {
      return res
        .status(HttpStatus.FOUND)
        .json({ message: 'Neighborhood already exists!' });
    }

    const options = { where: { idNeighborhood: param.id } };
    const neighborhood = await this._service.update(body, options, options);

    if (neighborhood) {
      return res.status(HttpStatus.OK).json(neighborhood);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Neighborhood doesn't exist!" });
  }
}
