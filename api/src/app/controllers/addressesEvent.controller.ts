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
import { AddressesEventService } from 'src/domain/services/addressesEvent.service';
import { Address } from 'src/domain/entities/address.entity';
import { AddressesEventDto } from 'src/domain/dto/addressesEvent.dto';
import { User } from 'src/domain/entities/user.entity';

@ApiTags('addressesEvents')
@Controller('addressesEvents')
export class AddressesEventController {
  constructor(private readonly _service: AddressesEventService) {}

  /**
   *
   * @returns {PaginateResponseDto{}} Returns all addresses events with theirs pagination
   * @param {PaginateOptions} request
   */
  @ApiOperation({ summary: 'Read all addresses' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Addresses events has been successfully finded.',
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
    const addressesEvents = await this._service.paginate({
      page,
      offset,
      order: [['idAddressesEvent', 'ASC']],
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
                idAddressesEvent: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                idAddress: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                event: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                data: {
                  [Op.like]: `%${options.search}%`,
                },
              },
            ],
          },
        ],
      },
      include: [
        {
          model: Address,
          as: 'address',
        },
      ],
    });
    return res.status(HttpStatus.OK).json(addressesEvents);
  }

  /**
   *
   * @returns {AddressesEventDto{}} Returns an address event by id
   * @param {id} request
   */
  @ApiOperation({ summary: 'Find an address event' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: AddressesEventDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Address event doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  public async findOne(@Response() res, @Param() param) {
    const addressesEvent = await this._service.findOne({
      where: { idAddressesEvent: param.id },
    });

    if (addressesEvent) {
      return res.status(HttpStatus.OK).json(addressesEvent);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Address event doesn't exist!" });
  }

  /**
   *
   * @returns {AddressesEventDto{}} Returns a new address event
   * @param {AddressesEventDto} request
   */
  @ApiOperation({ summary: 'Create address event' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: AddressesEventDto,
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
    description: 'Address event already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(
    @Response() res,
    @Body() addressesEventDto: AddressesEventDto,
    @Request() req,
  ) {
    const addressesEvent = await this._service.create(addressesEventDto);
    if (addressesEvent) {
      return res.status(HttpStatus.OK).json(addressesEvent);
    }
  }

  /**
   *
   * @returns {AddressesEventDto{}} Returns an address event updated
   * @param {AddressesEventDto} request
   */
  @ApiOperation({ summary: 'Update address event' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: AddressesEventDto,
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
    description: 'Address event already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  public async update(@Param() param, @Response() res, @Body() body) {
    const options = { where: { idAddressesEvent: param.id } };
    const addressesEvent = await this._service.update(body, options, options);

    if (addressesEvent) {
      return res.status(HttpStatus.OK).json(addressesEvent);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Address event doesn't exist!" });
  }

  /**
   *
   * @returns {AddressesEventDto{}} Returns an address event by id address
   * @param {id} request
   */
  @ApiOperation({ summary: 'Find an address event by id address' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: AddressesEventDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Address event doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/address/:id')
  public async findAllByAddress(@Param() param, @Response() res) {
    const addressesEvents = await this._service.findAll({
      where: { idAddress: param.id },
      order: [['idAddressesEvent', 'DESC']],
      include: [
        {
          model: Address,
          as: 'address',
        },
        {
          model: User,
          as: 'user',
        },
      ],
      raw: true,
      nest: true,
    });

    return res.status(HttpStatus.OK).json(addressesEvents);
  }
}
