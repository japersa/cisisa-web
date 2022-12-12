import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Response,
  UseGuards,
} from '@nestjs/common';
import { RouteObservationService } from '../../domain/services/routeObservation.service';
import { RouteObservationDto } from '../../domain/dto/routeObservation.dto';
import { PaginateOptions } from 'src/domain/services/crud.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginateResponseDto } from 'src/domain/dto/paginated-response.dto';
import { Op, Sequelize } from 'sequelize';

@ApiTags('routeObservations')
@Controller('routeObservations')
export class RouteObservationController {
  constructor(private readonly _service: RouteObservationService) {}

  /**
   *
   * @returns {PaginateResponseDto{}} Returns all route observations with theirs pagination
   * @param {PaginateOptions} request
   */
  @ApiOperation({ summary: 'Read all observations by route' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Observations has been successfully finded.',
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
    const observations = await this._service.paginate({
      page,
      offset,
      order: [['observation', 'ASC']],
      where: {
        [Op.and]: [
          search != '' && {
            [Op.or]: [
              {
                idRouteObservation: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                observation: {
                  [Op.like]: `%${options.search}%`,
                },
              },
            ],
          },
        ],
      },
    });
    return res.status(HttpStatus.OK).json(observations);
  }

  /**
   *
   * @returns {RouteObservationDto{}} Returns a observations by id
   * @param {id} request
   */
  @ApiOperation({ summary: 'Search a observation' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: RouteObservationDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Observation doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  public async findOne(@Response() res, @Param() param) {
    const observation = await this._service.findOne({
      where: { idRouteObservation: param.id },
    });

    if (observation) {
      return res.status(HttpStatus.OK).json(observation);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Observation doesn't exist!" });
  }

  /**
   *
   * @returns {RouteObservationDto{}} Returns a new observation
   * @param {RouteObservationDto} request
   */
  @ApiOperation({ summary: 'Create observation' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: RouteObservationDto,
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
    description: 'Observation already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(
    @Response() res,
    @Body() routeObservationDto: RouteObservationDto,
  ) {
    const observation = await this._service.create(routeObservationDto);
    return res.status(HttpStatus.OK).json(observation);
  }

  /**
   *
   * @returns {RouteObservationDto{}} Returns the modified observation
   * @param {id} request
   * @param {RouteObservationDto} request
   */
  @ApiOperation({ summary: 'Change the observation state' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record state has been successfully changed.',
    type: RouteObservationDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Observation doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/changeState/:id')
  public async changeState(@Param() param, @Response() res, @Body() body) {
    const options = { where: { idRouteObservation: param.id } };
    body = { ...body, isActive: !body.isActive };
    const observation = await this._service.update(body, options, options);
    if (observation) {
      return res.status(HttpStatus.OK).json(observation);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Observation doesn't exist!" });
  }

  /**
   *
   * @returns {RouteObservationDto{}} Returns a updated observation
   * @param {id} request
   * @param {RouteObservationDto} request
   */
  @ApiOperation({ summary: 'Update observation' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully updated.',
    type: RouteObservationDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Observation doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Observation already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  public async update(@Param() param, @Response() res, @Body() body) {
    const options = { where: { idRouteObservation: param.id } };
    const observation = await this._service.update(body, options, options);

    if (observation) {
      return res.status(HttpStatus.OK).json(observation);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Observation doesn't exist!" });
  }
}
