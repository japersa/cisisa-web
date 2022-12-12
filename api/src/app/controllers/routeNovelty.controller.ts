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
  UploadedFile,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { PaginateOptions } from 'src/domain/services/crud.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginateResponseDto } from 'src/domain/dto/paginated-response.dto';
import { Model, Op, QueryTypes, Sequelize } from 'sequelize';
import { RouteNoveltyService } from 'src/domain/services/routeNovelty.service';
import { Route } from 'src/domain/entities/route.entity';
import { RouteNoveltyDto } from 'src/domain/dto/routeNovelty.dto';
import { AddressesEventService } from 'src/domain/services/addressesEvent.service';
import { RouteService } from 'src/domain/services/route.service';

@ApiTags('routeNovelties')
@Controller('routeNovelties')
export class RouteNoveltyController {
  constructor(
    private readonly _service: RouteNoveltyService,
    private readonly _serviceAddressesEvent: AddressesEventService,
    private readonly _serviceRoute: RouteService,
  ) { }

  /**
   *
   * @returns {PaginateResponseDto{}} Returns all route novelties with theirs pagination
   * @param {PaginateOptions} request
   */
  @ApiOperation({ summary: 'Read all novelties' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Route nolvelties has been successfully finded.',
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
    const routeNovelties = await this._service.paginate({
      page,
      offset,
      order: [['idRouteNovelty', 'ASC']],
      where: {
        [Op.and]: [
          req.user.role.idCompany && {
            idCompany: {
              [Op.eq]: req.user.role.idCompany,
            },
          },
          search != '' && {
            [Op.or]: [
              {
                idRouteNovelty: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                idRoute: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                idNovelty: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                description: {
                  [Op.like]: `%${options.search}%`,
                },
              },
            ],
          },
        ],
      },
      include: [
        {
          model: Route,
          as: 'route',
        },
      ],
    });
    return res.status(HttpStatus.OK).json(routeNovelties);
  }

  /**
   *
   * @returns {RouteNoveltyDto{}} Returns a route novelty by id
   * @param {id} request
   */
  @ApiOperation({ summary: 'Find a route novelty' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: RouteNoveltyDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Route novelty doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  public async findOne(@Response() res, @Param() param) {
    const routeNovelty = await this._service.findOne({
      where: { idRouteNovelty: param.id },
    });

    if (routeNovelty) {
      return res.status(HttpStatus.OK).json(routeNovelty);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Route novelty doesn't exist!" });
  }

  /**
   *
   * @returns {RouteNoveltyDto{}} Returns a new route novelty
   * @param {RouteNoveltyDto} request
   */
  @ApiOperation({ summary: 'Create route novelty' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: RouteNoveltyDto,
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
    description: 'Route novelty already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(
    @Response() res,
    @Body() routeNoveltyDto: RouteNoveltyDto,
    @Request() req,
  ) {
    const routeNovelty = await this._service.create(routeNoveltyDto);

    const objRouteSelected = await this._serviceRoute.findOne({
      where: { idRoute: routeNovelty.idRoute },
      raw: true,
    });

    const objAddressesEventDto = {
      idAddress: objRouteSelected.idAddress,
      event: 'CREATE_ROUTE_NOVELTY',
      data: routeNovelty,
      idCreationUser: req.user.idUser,
      createdAt: new Date(),
    };

    await this._serviceAddressesEvent.create(objAddressesEventDto);

    if (routeNovelty) {
      return res.status(HttpStatus.OK).json(routeNovelty);
    }
  }

  /**
   *
   * @returns {RouteNoveltyDto{}} Returns a route novelty updated
   * @param {id} request
   */
  @ApiOperation({ summary: 'Update a route novelty' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: RouteNoveltyDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Route novelty doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  public async update(
    @Param() param,
    @Response() res,
    @Body() body,
    @Request() req,
  ) {
    const options = { where: { idRouteNovelty: param.id } };
    const routeNovelty = await this._service.update(body, options, options);

    const objRouteSelected = await this._serviceRoute.findOne({
      where: { idRoute: routeNovelty.idRoute },
      raw: true,
    });

    const objAddressesEventDto = {
      idAddress: objRouteSelected.idAddress,
      event: 'UPDATE_ROUTE_NOVELTY',
      data: routeNovelty,
      idCreationUser: req.user.idUser,
      createdAt: new Date(),
    };

    await this._serviceAddressesEvent.create(objAddressesEventDto);

    if (routeNovelty) {
      return res.status(HttpStatus.OK).json(routeNovelty);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Route novelty doesn't exist!" });
  }
}
