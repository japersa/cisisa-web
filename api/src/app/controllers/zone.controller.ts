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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ZoneService } from '../../domain/services/zone.service';
import { ZoneDto } from '../../domain/dto/zone.dto';
import { PaginateOptions } from 'src/domain/services/crud.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginateResponseDto } from 'src/domain/dto/paginated-response.dto';
import { Zone } from 'src/domain/entities/zone.entity';
import { Op, Sequelize } from 'sequelize';
import { Area } from 'src/domain/entities/area.entity';
import { Company } from 'src/domain/entities/company.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import { City } from 'src/domain/entities/city.entity';
import { CityService } from 'src/domain/services/city.service';

const tj = require('@tmcw/togeojson');
const DOMParser = require('xmldom').DOMParser;

@ApiTags('zones')
@Controller('zones')
export class ZoneController {
  constructor(
    private readonly _service: ZoneService,
    private readonly _serviceCity: CityService,
  ) {}

  /**
   *
   * @returns {PaginateResponseDto{}} Returns all zones with theirs pagination
   * @param {PaginateOptions} request
   */
  @ApiOperation({ summary: 'Read all zones' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Zones has been successfully finded.',
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
    const zones = await this._service.paginate({
      page,
      offset,
      order: [['description', 'ASC']],
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
                idZone: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                description: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              Sequelize.where(Sequelize.col('company.description'), {
                [Op.like]: `%${options.search}%`,
              }),
              Sequelize.where(Sequelize.col('city.description'), {
                [Op.like]: `%${options.search}%`,
              }),
            ],
          },
        ],
      },
      include: [
        {
          model: Company,
          as: 'company',
        },
        {
          model: City,
          as: 'city',
        },
      ],
    });
    return res.status(HttpStatus.OK).json(zones);
  }

  /**
   *
   * @returns {ZoneDto{}} Returns all zones by idCity
   * @param {id} request
   */
  @ApiOperation({ summary: 'Search neighborhoods by city' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: ZoneDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Zone doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/city/:idCity')
  public async findAllByCity(@Response() res, @Param() param, @Request() req) {
    const zones = await this._service.findAll({
      where: {
        idCity: param.idCity,
        ...(req.user.role.idCompany && { idCompany: req.user.role.idCompany }),
      },
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

    if (zones) {
      return res.status(HttpStatus.OK).json(zones);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Zone doesn't exist!" });
  }

  /**
   *
   * @returns {Zone{}} Returns a zone by id
   * @param {id} request
   */
  @ApiOperation({ summary: 'Search a zone' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: Zone,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Zone doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  public async findOne(@Response() res, @Param() param) {
    const zone = await this._service.findOne({
      where: { idZone: param.id },
      include: [
        {
          model: Company,
          as: 'company',
        },
        {
          model: City,
          as: 'city',
        },
      ],
      raw: true,
      nest: true,
    });

    if (zone) {
      return res.status(HttpStatus.OK).json(zone);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Zone doesn't exist!" });
  }

  /**
   *
   * @returns {Zone{}} Returns a new zone
   * @param {ZoneDto} request
   */
  @ApiOperation({ summary: 'Create zone' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: Zone,
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
    description: 'Zone already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(@Response() res, @Body() zoneDto: ZoneDto) {
    zoneDto.description = zoneDto.description.toUpperCase();
    const zoneExists = await this._service.findOne({
      where: {
        description: zoneDto.description.toUpperCase(),
        idCompany: zoneDto.idCompany,
      },
    });
    if (zoneExists) {
      return res
        .status(HttpStatus.FOUND)
        .json({ message: 'Zone already exists!' });
    }
    const zone = await this._service.create(zoneDto);
    return res.status(HttpStatus.OK).json(zone);
  }

  /**
   *
   * @returns {ZoneDto{}} Returns the modified country
   * @param {id} request
   * @param {ZoneDto} request
   */
  @ApiOperation({ summary: 'Change the country state' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record state has been successfully changed.',
    type: ZoneDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Zone doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/changeState/:id')
  public async changeState(@Param() param, @Response() res, @Body() body) {
    const options = { where: { idZone: param.id } };
    body = { ...body, isActive: !body.isActive };
    const zone = await this._service.update(body, options, options);
    if (zone) {
      return res.status(HttpStatus.OK).json(zone);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Zone doesn't exist!" });
  }

  /**
   *
   * @returns {Zone{}} Returns a updated zone
   * @param {id} request
   * @param {Zone} request
   */
  @ApiOperation({ summary: 'Update zone' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully updated.',
    type: Zone,
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
    status: HttpStatus.NOT_FOUND,
    description: "Zone doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Zone already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  public async update(@Param() param, @Response() res, @Body() body) {
    body.description = body.description.toUpperCase();
    const zoneExists = await this._service.findOne({
      where: {
        description: body.description.toUpperCase(),
        idCompany: body.idCompany,
      },
    });
    if (zoneExists && param.id != zoneExists.idZone) {
      return res
        .status(HttpStatus.FOUND)
        .json({ message: 'Zone already exists!' });
    }

    const options = { where: { idZone: param.id } };
    const zone = await this._service.update(body, options, options);

    if (zone) {
      return res.status(HttpStatus.OK).json(zone);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Zone doesn't exist!" });
  }

  // @UseGuards(JwtAuthGuard)
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  public async upload(
    @UploadedFile() file,
    @Body() body,
    @Response() res,
    @Request() req,
  ) {
    const kml = new DOMParser().parseFromString(
      fs.readFileSync(path.resolve(process.cwd(), file.path), 'utf8'),
    );

    const converted = tj.kml(kml);

    console.log(JSON.stringify(converted));

    // const citySelected = await this._serviceCity.findOne({
    //   where: { idCity: body.city },
    //   raw: true,
    // });
    // if (
    //   converted.features[0].properties.name != citySelected.description
    // ) {
    //   return res
    //     .status(HttpStatus.PRECONDITION_FAILED)
    //     .json({ message: 'The file does not correspond to the city!' });
    // }

    //TODO: save areas from generated json
    for (let index = 1; index < converted.features.length; index++) {
      const element = converted.features[index];

      element.properties.name = element.properties.name.toUpperCase();
      const zoneExists = await this._service.findOne({
        where: {
          description: element.properties.name.toUpperCase(),
          idCompany: body.company,
        },
        raw: true,
      });
      const objDto = {
        description: element.properties.name,
        properties: element.properties,
        geometry: element.geometry,
        isActive: true,
        idCompany: body.company,
        idCity: body.city,
      };
      if (zoneExists) {
        const options = { where: { idZone: zoneExists.idZone } };
        await this._service.update(objDto, options, options);
      } else {
        await this._service.create(objDto);
      }
    }

    fs.unlinkSync(file.path);

    res.status(HttpStatus.OK).json('file uploaded successfully');
  }
}
