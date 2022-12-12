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
import { AddressService } from '../../domain/services/address.service';
import { AddressDto } from '../../domain/dto/address.dto';
import { PaginateOptions } from 'src/domain/services/crud.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginateResponseDto } from 'src/domain/dto/paginated-response.dto';
import { Model, Op, QueryTypes, Sequelize } from 'sequelize';
import { Company } from 'src/domain/entities/company.entity';
import { Neighborhood } from 'src/domain/entities/neighborhood.entity';
import { FileInterceptor } from '@nestjs/platform-express';
// import * as cvs from 'csvtojson';
import { stdout } from 'node:process';
import { Client } from '@googlemaps/google-maps-services-js';
import * as path from 'path';
import * as parse from 'csv-parse';
import { CityService } from 'src/domain/services/city.service';
import { NeighborhoodService } from 'src/domain/services/neighborhood.service';
import { ZoneNeighborhoodService } from 'src/domain/services/zone_neighborhood.service';
import { Zone } from 'src/domain/entities/zone.entity';
import { ZoneService } from 'src/domain/services/zone.service';
import { ZoneNeighborhoodDto } from 'src/domain/dto/zone_neighborhood.dto';
import { CompanyService } from 'src/domain/services/company.services';
import { AddressesEventService } from 'src/domain/services/addressesEvent.service';
import * as Excel from 'exceljs';

// const csv = require('csv-parser');
const fs = require('fs');
const { Readable } = require('stream');
// const cvs = require('csvtojson');
const http = require('http');

const express = require('express');
const multer = require('multer');
const csv2 = require('fast-csv');

const Router = express.Router;
const upload = multer({ dest: 'tmp/csv/' });
const app = express();
const router = new Router();
const server = http.createServer(app);
const port = 9000;
const { Parser } = require('json2csv');
const geolib = require('geolib');

@ApiTags('addresses')
@Controller('addresses')
export class AddressController {
  constructor(
    private readonly _service: AddressService,
    private readonly _serviceCity: CityService,
    private readonly _serviceNeighborhood: NeighborhoodService,
    private readonly _serviceZoneNeighborhood: ZoneNeighborhoodService,
    private readonly _serviceZone: ZoneService,
    private readonly _serviceAddressesEvent: AddressesEventService,
    @Inject('DATABASE_CONNECTION') private readonly sequelize,
  ) {}

  async getQuery(query, params) {
    return await this.sequelize.query(query, {
      replacements: params,
      logging: console.log,
      plain: false,
      type: QueryTypes.SELECT,
    });
  }

  /**
   *
   * @returns {PaginateResponseDto{}} Returns all addresses with theirs pagination
   * @param {PaginateOptions} request
   */
  @ApiOperation({ summary: 'Read all addresses' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Addresses has been successfully finded.',
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
    const addresses = await this._service.paginate({
      page,
      offset,
      order: [['idAddress', 'DESC']],
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
                idAddress: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                guide: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                name: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                direction: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                reference1: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                reference2: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                '$neighborhood.description$': {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                '$company.description$': {
                  [Op.like]: `%${options.search}%`,
                },
              },
            ],
          },
        ],
      },
      include: [
        {
          model: Neighborhood,
          as: 'neighborhood',
        },
        {
          model: Company,
          as: 'company',
        },
        {
          model: Zone,
          as: 'zone',
        },
      ],
    });
    return res.status(HttpStatus.OK).json(addresses);
  }

  /**
   *
   * @returns {PaginateResponseDto{}} Returns all addresses with theirs pagination
   * @param {PaginateOptions} request
   */
  @ApiOperation({ summary: 'Read all addresses' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Addresses has been successfully finded.',
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
  @Get('/available')
  public async findAllAvailable(
    @Response() res,
    @Query() options: any,
    @Request() req,
  ) {
    const { page, offset, search, idCity, idZone, state } = options;
    const addresses = await this._service.paginate({
      page,
      offset,
      order: [['idAddress', 'ASC']],
      where: {
        [Op.and]: [
          req.user.role.idCompany && {
            idCompany: {
              [Op.eq]: req.user.role.idCompany,
            },
          },
          state && {
            state: state,
          },
          !state && {
            state: {
              [Op.in]: [1, 2, 6],
            },
          },
          idCity && {
            idCity: idCity,
          },
          idZone && {
            idZone: idZone,
          },
          search != '' && {
            [Op.or]: [
              {
                idAddress: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                direction: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                reference1: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                reference2: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                '$neighborhood.description$': {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                '$company.description$': {
                  [Op.like]: `%${options.search}%`,
                },
              },
            ],
          },
        ],
      },
      include: [
        {
          model: Neighborhood,
          as: 'neighborhood',
        },
        {
          model: Company,
          as: 'company',
        },
        {
          model: Zone,
          as: 'zone',
        },
      ],
    });
    return res.status(HttpStatus.OK).json(addresses);
  }

  /**
   *
   * @returns {AddressDto{}} Returns all addresses by city
   * @param {AddressDto} request
   */
  @ApiOperation({ summary: 'Read all addresses by city' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Addresses has been successfully finded.',
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
  @Get('/city/:idCity')
  public async findAllByCity(@Response() res, @Param() param) {
    const addresses = await this._service.findAll({
      where: { idCity: param.idCity },
      raw: true,
      include: [
        {
          model: Neighborhood,
          as: 'neighborhood',
        },
        {
          model: Company,
          as: 'company',
        },
        {
          model: Zone,
          as: 'zone',
        },
      ],
      nest: true,
    });
    return res.status(HttpStatus.OK).json(addresses);
  }

  /**
   *
   * @returns {AddressDto{}} Returns all addresses by zone
   * @param {AddressDto} request
   */
  @ApiOperation({ summary: 'Read all addresses by zone' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Addresses has been successfully finded.',
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
  @Get('/zone/:idZone')
  public async findAllByZone(@Response() res, @Param() param) {
    const addresses = await this._service.findAll({
      where: { idZone: param.idZone },
      raw: true,
      include: [
        {
          model: Neighborhood,
          as: 'neighborhood',
        },
        {
          model: Company,
          as: 'company',
        },
        {
          model: Zone,
          as: 'zone',
        },
      ],
      nest: true,
    });
    return res.status(HttpStatus.OK).json(addresses);
  }

  /**
   *
   * @returns {} Returns a file with the address errors
   */
  @ApiOperation({ summary: 'Find errors' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'File downloaded.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "File doesn't process!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  //@UseGuards(JwtAuthGuard)
  @Post('/download')
  public async downloadFile(@Response() res, @Body() body) {
    const errors = await this._service.findAll({
      where: {
        [Op.and]: [
          { state: { [Op.in]: [-1] } },
          body.idCompany && {
            idCompany: {
              [Op.eq]: body.idCompany,
            },
          },
        ],
      },
      raw: true,
    });

    const errorsData = errors.map((elem, key) => ({
      guide: elem.guide,
      name: elem.name,
      direction: elem.direction,
      idCity: elem.idCity,
      idNeighborhood: elem.idNeighborhood,
      reference1: elem.reference1,
      reference2: elem.reference2,
      clientGuide: elem.clientGuide,
      declaredValue: elem.declaredValue,
      remitent: elem.remitent,
      collection: elem.collection,
      product: elem.product,
    }));

    const now = new Date();
    const dateNow = `${now.getFullYear()}-${
      now.getMonth() + 1
    }-${now.getDate()}`;

    console.log(errorsData);

    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Direcciones erróneas');
    worksheet.columns = [
      { header: 'Guía No.', key: 'guide', width: 10 },
      { header: 'Nombre.', key: 'name', width: 10 },
      { header: 'Dirección', key: 'direction', width: 10 },
      { header: 'Ciudad', key: 'idCity', width: 10 },
      { header: 'Barrio', key: 'idNeighborhood', width: 10 },
      { header: 'Referencia 1', key: 'reference1', width: 10 },
      { header: 'Referencia 2', key: 'reference2', width: 10 },
      { header: 'Guía Cliente No.', key: 'clientGuide', width: 10 },
      { header: 'Valor Declarado', key: 'declaredValue', width: 10 },
      { header: 'Remitente', key: 'remitent', width: 10 },
      { header: 'Recaudo', key: 'collection', width: 10 },
      { header: 'Producto', key: 'product', width: 10 },
    ];
    worksheet.addRows(errorsData);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + `${dateNow + '-errors-addresses'}` + '.xlsx',
    );
    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  }

  /**
   *
   * @returns {AddressDto{}} Returns an address by id
   * @param {id} request
   */
  @ApiOperation({ summary: 'Find an address' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: AddressDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Address doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  public async findOne(@Response() res, @Param() param) {
    const address = await this._service.findOne({
      where: { idAddress: param.id },
    });

    if (address) {
      return res.status(HttpStatus.OK).json(address);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Address doesn't exist!" });
  }

  /**
   *
   * @returns {AddressDto{}} Returns a new address
   * @param {AddressDto} request
   */
  @ApiOperation({ summary: 'Create address' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: AddressDto,
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
    description: 'Address already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  public async upload(
    @UploadedFile() file,
    @Body() body,
    @Response() res,
    @Request() req,
  ) {
    try {
      let zones = [];

      if (body.city) {
        zones = await this._serviceZone.findAll({
          where: { idCity: body.city, idCompany: body.company },
          raw: true,
        });
      }

      const sqlCompany = `SELECT C.*
      FROM TBL_MTR_USER U
        INNER JOIN TBL_MTR_ROLE R ON U.idRole = R.idRole
        INNER JOIN TBL_MTR_COMPANY C ON R.idCompany = C.idCompany
      WHERE idUser = :idCompany;`;
      const params = {
        idCompany: req.user.role.idCompany,
      };
      const company = await this.getQuery(sqlCompany, params);

      if (
        company[0].gcp_pwd == undefined ||
        company[0].gcp_pwd == null ||
        company[0].gcp_pwd == ''
      ) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json('Company doesn´t have a Google key');
      }

      const data = [];

      fs.createReadStream(path.resolve(process.cwd(), file.path))
        .pipe(parse({ delimiter: ';' }))
        // pipe the parsed input into a csv formatter
        .on('error', (error) => {
          console.error(error);
        })
        // pipe the parsed input into a csv formatter
        .on('data', async (row) => {
          data.push(row);
          console.log(row);
        })
        .on('end', () => {
          data.forEach((row) => {
            const client = new Client({});

            client
              .geocode({
                params: {
                  address: String(row[2]).includes(row[3], row[4])
                    ? row[2]
                    : String(row[2]).concat(', ', row[4], ', ', row[3]),
                  key:
                    company && company[0].gcp_pwd != '' && company[0].gcp_pwd, //process.env.GOOGLE_MAPS_API_KEY,
                },
                timeout: 3000, // milliseconds
              })
              .then(async (r) => {
                if (r.data.status == 'OK') {
                  const { lat, lng } = r.data.results[0].geometry.location;
                  let zone = null;

                  if (zones.length > 0) {
                    for (let index = 0; index < zones.length; index++) {
                      const element = zones[index];
                      console.log(element.geometry);
                      let zonePolygon = element.geometry.coordinates
                        ? element.geometry.coordinates[0].map((coord) => {
                            return { latitude: coord[1], longitude: coord[0] };
                          })
                        : element.geometry.geometries[1]
                        ? element.geometry.geometries[1].coordinates[0].map(
                            (coord) => {
                              return {
                                latitude: coord[1],
                                longitude: coord[0],
                              };
                            },
                          )
                        : [];

                      const existsIntoZone = geolib.isPointInPolygon(
                        { latitude: lat, longitude: lng },
                        zonePolygon,
                      );

                      if (existsIntoZone) {
                        zone = element.idZone;
                        console.log(zone);
                        break;
                      }
                    }
                  }

                  const guideExists = await this._service.findOne({
                    where: { guide: row[0] },
                    raw: true,
                  });

                  const city = await this._serviceCity.findOne({
                    where: {
                      description: { [Op.like]: String(row[3]).toUpperCase() },
                    },
                    raw: true,
                  });

                  const neighborhood = await this._serviceNeighborhood.findOne({
                    where: {
                      description: { [Op.like]: String(row[4]).toUpperCase() },
                      idCity: city.idCity,
                    },
                    raw: true,
                  });

                  let objDto = {
                    guide: row[0],
                    name: row[1],
                    direction: row[2],
                    idCity: city ? city.idCity : null,
                    idNeighborhood: neighborhood
                      ? neighborhood.idNeighborhood
                      : null,
                    reference1: row[5],
                    reference2: row[6],
                    clientGuide: row[7],
                    declaredValue: row[8],
                    lat: lat,
                    lon: lng,
                    state: 1,
                    idCompany: body.company,
                    remitent: row[9],
                    collection: row[10],
                    product: row[11],
                    idZone: zone,
                  };

                  let objAddress;
                  if (guideExists && guideExists.state != 3) {
                    const options = { where: { guide: row[0] } };
                    objDto = { ...objDto, state: 2 };
                    objAddress = await this._service.update(
                      objDto,
                      options,
                      options,
                    );
                  } else if (guideExists && guideExists.state == 3) {
                    objDto = { ...objDto, state: -1 };
                    objAddress = await this._service.create(objDto);
                  } else {
                    objAddress = await this._service.create(objDto);
                  }
                  const objAddressesEventDto = {
                    idAddress: objAddress.idAddress,
                    event: 'UPLOAD_ADDRESS',
                    data: objAddress,
                    idCreationUser: req.user.idUser,
                    createdAt: new Date(),
                  };

                  await this._serviceAddressesEvent.create(
                    objAddressesEventDto,
                  );
                } else {
                  const city = await this._serviceCity.findOne({
                    where: {
                      description: { [Op.like]: String(row[3]).toUpperCase() },
                    },
                    raw: true,
                  });

                  const neighborhood = await this._serviceNeighborhood.findOne({
                    where: {
                      description: { [Op.like]: String(row[4]).toUpperCase() },
                    },
                    raw: true,
                  });

                  const objDto = {
                    guide: row[0],
                    name: row[1],
                    direction: row[2],
                    idCity: city ? city.idCity : null,
                    idNeighborhood: neighborhood
                      ? neighborhood.idNeighborhood
                      : null,
                    reference1: row[5],
                    reference2: row[6],
                    clientGuide: row[7],
                    declaredValue: row[8],
                    lat: '',
                    lon: '',
                    state: -1,
                    idCompany: body.company,
                    collection: row[10],
                    product: row[11],
                    idZone: null,
                  };

                  await this._service.create(objDto);

                  console.log(
                    'Geocode was not successful for the following reason: ' +
                      r.data.status,
                  );
                }
              })
              .catch((e) => {
                console.log(e);
              });
          });
          console.log(data.length);
          console.log(`Parsed rows`);
          fs.unlinkSync(file.path);
          return res.status(HttpStatus.OK).json({
            message: 'file uploaded successfully',
            total: data.length,
          });
        });
    } catch (e) {
      console.log(e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e);
    }
  }

  /**
   *
   * @returns {AddressDto{}} Returns a new address
   * @param {AddressDto} request
   */
  @ApiOperation({ summary: 'Create address' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: AddressDto,
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
    description: 'Address already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(
    @Response() res,
    @Body() addressDto: AddressDto,
    @Request() req,
  ) {
    const addressExists = await this._service.findOne({
      where: { direction: addressDto.direction, guide: addressDto.guide },
    });
    if (addressExists) {
      return res
        .status(HttpStatus.FOUND)
        .json({ message: 'Address already exists!' });
    }
    const client = new Client({});

    const sqlCompany = `SELECT C.*
      FROM TBL_MTR_USER U
        INNER JOIN TBL_MTR_ROLE R ON U.idRole = R.idRole
        INNER JOIN TBL_MTR_COMPANY C ON R.idCompany = C.idCompany
      WHERE idUser = :idCompany;`;
    const params = {
      idCompany: req.user.role.idCompany,
    };
    const company = await this.getQuery(sqlCompany, params);

    if (
      company[0].gcp_pwd == undefined ||
      company[0].gcp_pwd == null ||
      company[0].gcp_pwd == ''
    ) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json('Company doesn´t have a Google key');
    }

    client
      .geocode({
        params: {
          address: addressDto.direction,
          key: company && company[0].gcp_pwd != '' && company[0].gcp_pwd, //process.env.GOOGLE_MAPS_API_KEY,
        },
        timeout: 3000, // milliseconds
      })
      .then(async (r) => {
        if (r.data.status == 'OK') {
          const { lat, lng } = r.data.results[0].geometry.location;

          const guideExists = await this._service.findOne({
            where: { guide: addressDto.guide },
            raw: true,
          });

          const objDto = {
            ...addressDto,
            lat: lat,
            lon: lng,
            state: guideExists ? -1 : 1,
          };

          const address = await this._service.create(objDto);

          const objAddressesEventDto = {
            idAddress: address.idAddress,
            event: 'CREATE_ADDRESS',
            data: address,
            idCreationUser: req.user.idUser,
            createdAt: new Date(),
          };

          await this._serviceAddressesEvent.create(objAddressesEventDto);

          return res.status(HttpStatus.OK).json(address);
        } else {
          const objDto = {
            ...addressDto,
            lat: '',
            lon: '',
            state: -1,
          };

          const objAddress = await this._service.create(objDto);
          const objAddressesEventDto = {
            idAddress: objAddress.idAddress,
            event: 'CREATE_ADDRESS',
            data: objAddress,
            idCreationUser: req.user.idUser,
            createdAt: new Date(),
          };

          await this._serviceAddressesEvent.create(objAddressesEventDto);
          console.log(
            'Geocode was not successful for the following reason: ' +
              r.data.status,
          );
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message:
              'Geocode was not successful for the following reason: ' +
              r.data.status,
          });
        }
      })
      .catch((e) => {
        console.log(e);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e);
      });
  }

  /**
   *
   * @returns {AddressDto{}} Returns the modified address
   * @param {id} request
   * @param {AddressDto} request
   */
  @ApiOperation({ summary: 'Change the country state' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record state has been successfully changed.',
    type: AddressDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Address doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/changeState/:id')
  public async changeState(
    @Param() param,
    @Response() res,
    @Body() body,
    @Request() req,
  ) {
    const options = { where: { idAddress: param.id } };
    body = { ...body, isActive: !body.isActive };
    const address = await this._service.update(body, options, options);

    const objAddressesEventDto = {
      idAddress: param.id,
      event: body.isActive ? 'ACTIVE AN ADDRESS' : 'DISACTIVE AN ADDRESS',
      data: address,
      idCreationUser: req.user.idUser,
      createdAt: new Date(),
    };

    await this._serviceAddressesEvent.create(objAddressesEventDto);

    if (address) {
      return res.status(HttpStatus.OK).json(address);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Address doesn't exist!" });
  }

  /**
   *
   * @returns {AddressDto{}} Returns a updated address
   * @param {id} request
   * @param {Address} request
   */
  @ApiOperation({ summary: 'Update address' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully updated.',
    type: AddressDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Address doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Address already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/changeStatusOnRoute/:id')
  public async updateChangeStatusOnRoute(
    @Param() param,
    @Response() res,
    @Body() body,
  ) {
    const options = { where: { idAddress: param.id } };
    const address = await this._service.update(body, options, options);

    if (address) {
      return res.status(HttpStatus.OK).json(address);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Address doesn't exist!" });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  public async update(
    @Param() param,
    @Response() res,
    @Body() body,
    @Request() req,
  ) {
    const addressExists = await this._service.findOne({
      where: { direction: body.direction, guide: body.guide },
    });
    if (addressExists && param.id != addressExists.idAddress) {
      return res
        .status(HttpStatus.FOUND)
        .json({ message: 'Address already exists!' });
    }

    const options = { where: { idAddress: param.id } };
    body.updatedAt = Date.now();
    const address = await this._service.update(body, options, options);

    const objAddressesEventDto = {
      idAddress: param.id,
      event: 'UPDATE_ADDRESS',
      data: address,
      idCreationUser: req.user.idUser,
      createdAt: new Date(),
    };

    await this._serviceAddressesEvent.create(objAddressesEventDto);

    if (address) {
      return res.status(HttpStatus.OK).json(address);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Address doesn't exist!" });
  }
}
