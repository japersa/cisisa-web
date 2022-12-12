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
  Request
} from '@nestjs/common';
import { RouteDetailService } from '../../domain/services/routeDetail.service';
import { RouteDetailDto } from '../../domain/dto/routeDetail.dto';
import { PaginateOptions } from 'src/domain/services/crud.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginateResponseDto } from 'src/domain/dto/paginated-response.dto';
import { Op, Sequelize } from 'sequelize';
import { RouteService } from 'src/domain/services/route.service';
import { AddressesEventService } from 'src/domain/services/addressesEvent.service';

@ApiTags('routeDetails')
@Controller('routeDetails')
export class RouteDetailController {
  constructor(private readonly _service: RouteDetailService, private readonly _routeservice: RouteService,
    private readonly _serviceAddressesEvent: AddressesEventService,
  ) { }

  /**
   *
   * @returns {PaginateResponseDto{}} Returns all route details with theirs pagination
   * @param {PaginateOptions} request
   */
  @ApiOperation({ summary: 'Read all details by route' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Details has been successfully finded.',
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
    const details = await this._service.paginate({
      page,
      offset,
      order: [['idRouteDetail', 'ASC']],
    });
    return res.status(HttpStatus.OK).json(details);
  }

  /**
   *
   * @returns {RouteDetailDto{}} Returns a details by id
   * @param {id} request
   */
  @ApiOperation({ summary: 'Search a detail' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: RouteDetailDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Detail doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  public async findOne(@Response() res, @Param() param) {
    const detail = await this._service.findOne({
      where: { idRouteDetail: param.id },
    });

    if (detail) {
      return res.status(HttpStatus.OK).json(detail);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Detail doesn't exist!" });
  }

  /**
   *
   * @returns {RouteDetailDto{}} Returns a new detail
   * @param {RouteDetailDto} request
   */
  @ApiOperation({ summary: 'Create detail' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: RouteDetailDto,
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
    description: 'Detail already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(@Response() res, @Body() routeDetailDto: RouteDetailDto, @Request() req,) {
    const detail = await this._service.create(routeDetailDto);
    const route = await this._routeservice.findOne({ where: { idRoute: routeDetailDto.idRoute } });

    const objAddressesEventDto = {
      idAddress: route.idAddress,
      event: 'CREATE_DETAIL_DELIVERY',
      data: detail,
      idCreationUser: req.user.idUser,
      createdAt: new Date(),
    };

    await this._serviceAddressesEvent.create(objAddressesEventDto);
    return res.status(HttpStatus.OK).json(detail);
  }

  /**
   *
   * @returns {RouteDetailDto{}} Returns the modified detail
   * @param {id} request
   * @param {RouteDetailDto} request
   */
  @ApiOperation({ summary: 'Change the detail state' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record state has been successfully changed.',
    type: RouteDetailDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Detail doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/changeState/:id')
  public async changeState(@Param() param, @Response() res, @Body() body) {
    const options = { where: { idRouteDetail: param.id } };
    body = { ...body, isActive: !body.isActive };
    const detail = await this._service.update(body, options, options);
    if (detail) {
      return res.status(HttpStatus.OK).json(detail);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Detail doesn't exist!" });
  }

  /**
   *
   * @returns {RouteDetailDto{}} Returns a updated detail
   * @param {id} request
   * @param {RouteDetailDto} request
   */
  @ApiOperation({ summary: 'Update detail' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully updated.',
    type: RouteDetailDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Detail doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Detail already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  public async update(@Param() param, @Response() res, @Body() body) {
    const options = { where: { idRouteDetail: param.id } };
    const detail = await this._service.update(body, options, options);

    if (detail) {
      return res.status(HttpStatus.OK).json(detail);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Detail doesn't exist!" });
  }
}
