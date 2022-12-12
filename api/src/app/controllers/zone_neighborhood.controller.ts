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
import { ZoneNeighborhoodService } from '../../domain/services/zone_neighborhood.service';
import { ZoneNeighborhoodDto } from '../../domain/dto/zone_neighborhood.dto';
import { PaginateOptions } from 'src/domain/services/crud.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginateResponseDto } from 'src/domain/dto/paginated-response.dto';
import { Op, Sequelize } from 'sequelize';
import { Zone } from 'src/domain/entities/zone.entity';
import { Neighborhood } from 'src/domain/entities/neighborhood.entity';

@ApiTags('zonesNeighborhoods')
@Controller('zonesNeighborhoods')
export class ZoneNeighborhoodController {
  constructor(private readonly _service: ZoneNeighborhoodService) {}

  /**
   *
   * @returns {PaginateResponseDto{}} Returns all zones neighborhoods with theirs pagination
   * @param {PaginateOptions} request
   */
  @ApiOperation({ summary: 'Read all Zones Neighborhoods' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Zones neighborhoods has been successfully finded.',
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
    const zonesNeighborhoods = await this._service.paginate({
      page,
      offset,
      where: {
        [Op.and]: [
          search != '' && {
            [Op.or]: [
              {
                idZoneNeighborhood: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              Sequelize.where(Sequelize.col('zone.idZone'), {
                [Op.like]: `%${options.search}%`,
              }),
              Sequelize.where(Sequelize.col('neighborhood.idNeighborhood'), {
                [Op.like]: `%${options.search}%`,
              }),
            ],
          },
          req.user.role.idCompany &&
            Sequelize.where(
              Sequelize.col('zone.idCompany'),
              req.user.role.idCompany,
            ),
        ],
      },
      include: [
        {
          model: Zone,
          as: 'zone',
        },
        {
          model: Neighborhood,
          as: 'neighborhood',
        },
      ],
    });
    return res.status(HttpStatus.OK).json(zonesNeighborhoods);
  }

  /**
   *
   * @returns {ZoneNeighborhoodDto{}} Returns all zone neighborhoods by idNeighborhood
   * @param {id} request
   */
  @ApiOperation({ summary: 'Search all zone neighborhoods by neighborhood' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: ZoneNeighborhoodDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Zone Neighborhood doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/neighborhoods/:idNeighborhood')
  public async findAllByZone(@Response() res, @Param() param) {
    const neighborhoods = await this._service.findAll({
      where: { idNeighborhood: param.idNeighborhood },
      include: [
        {
          model: Zone,
          as: 'zone',
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
      .json({ message: "Zone Neighborhood doesn't exist!" });
  }

  /**
   *
   * @returns {ZoneNeighborhoodDto{}} Returns a zone neighborhood by id
   * @param {id} request
   */
  @ApiOperation({ summary: 'Search a zone neighborhood' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: ZoneNeighborhoodDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Zone neighborhood doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  public async findOne(@Response() res, @Param() param) {
    const zoneNeighborhood = await this._service.findOne({
      where: { idZoneNeighborhood: param.id },
      raw: true,
      nest: true,
      include: [
        {
          model: Zone,
          as: 'zone',
        },
      ],
    });

    if (zoneNeighborhood) {
      return res.status(HttpStatus.OK).json(zoneNeighborhood);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Zone neighborhood doesn't exist!" });
  }

  /**
   *
   * @returns {ZoneNeighborhoodDto{}} Returns a new zone neighborhood
   * @param {ZoneNeighborhoodDto} request
   */
  @ApiOperation({ summary: 'Create zone neighborhood' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: ZoneNeighborhoodDto,
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
    description: 'Zone - neighborhood already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(
    @Response() res,
    @Body() zoneNeighborhoodDto: ZoneNeighborhoodDto,
    @Request() req,
  ) {
    let zoneNeighborhood;
    if (zoneNeighborhoodDto.multiselectRef.length > 0) {
      for (
        let index = 0;
        index < zoneNeighborhoodDto.multiselectRef.length;
        index++
      ) {
        const element = zoneNeighborhoodDto.multiselectRef[index];
        const zoneNeighborhoodExists = await this._service.findOne({
          where: {
            idZone: zoneNeighborhoodDto.idZone,
            idNeighborhood: element.idNeighborhood,
            ...(req.user.role.idCompany && {
              '$zone.idCompany$': req.user.role.idCompany,
            }),
          },
          include: [
            {
              model: Zone,
              as: 'zone',
            },
          ],
        });
        if (zoneNeighborhoodExists) {
          // return res
          //   .status(HttpStatus.FOUND)
          //   .json({ message: 'Zone - neighborhood already exists!' });
        } else {
          zoneNeighborhoodDto.idNeighborhood = Number(element.idNeighborhood);
          zoneNeighborhood = await this._service.create(zoneNeighborhoodDto);
        }
      }
    }

    return res.status(HttpStatus.OK).json(zoneNeighborhood);
  }

  /**
   *
   * @returns {ZoneNeighborhoodDto{}} Returns the modified zone neighborhood
   * @param {id} request
   * @param {ZoneNeighborhoodDto} request
   */
  @ApiOperation({ summary: 'Change the zone neighborhood state' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record state has been successfully changed.',
    type: ZoneNeighborhoodDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Zone neighborhood doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/changeState/:id')
  public async changeState(@Param() param, @Response() res, @Body() body) {
    const options = { where: { idZoneNeighborhood: param.id } };
    body = { ...body, isActive: !body.isActive };
    const zoneNeighborhood = await this._service.update(body, options, options);
    if (zoneNeighborhood) {
      return res.status(HttpStatus.OK).json(zoneNeighborhood);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Zone neighborhood doesn't exist!" });
  }

  /**
   *
   * @returns {ZoneNeighborhoodDto{}} Returns a updated zone neighborhood
   * @param {id} request
   * @param {ZoneNeighborhoodDto} request
   */
  @ApiOperation({ summary: 'Update zone neighborhood' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully updated.',
    type: ZoneNeighborhoodDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Zone neighborhood doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Zone - neighborhood already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  public async update(@Param() param, @Response() res, @Body() body) {
    const zoneNeighborhoodExists = await this._service.findOne({
      where: { idZone: body.idZone, idNeighborhood: body.idNeighborhood },
    });
    if (
      zoneNeighborhoodExists &&
      param.id != zoneNeighborhoodExists.idZoneNeighborhood
    ) {
      return res
        .status(HttpStatus.FOUND)
        .json({ message: 'Zone - neighborhood already exists!' });
    }

    const options = { where: { idZoneNeighborhood: param.id } };
    const zoneNeighborhood = await this._service.update(body, options, options);

    if (zoneNeighborhood) {
      return res.status(HttpStatus.OK).json(zoneNeighborhood);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Zone neighborhood doesn't exist!" });
  }
}
