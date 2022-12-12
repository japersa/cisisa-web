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
  Inject,
} from '@nestjs/common';
import { RouteService } from '../../domain/services/route.service';
import { RouteDto } from '../../domain/dto/route.dto';
import { PaginateOptions } from 'src/domain/services/crud.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginateResponseDto } from 'src/domain/dto/paginated-response.dto';
import { Route } from 'src/domain/entities/route.entity';
import { Op, QueryTypes, Sequelize } from 'sequelize';
import { Address } from 'src/domain/entities/address.entity';
import { AddressService } from 'src/domain/services/address.service';
import { Company } from 'src/domain/entities/company.entity';
import { User } from 'src/domain/entities/user.entity';
import { AddressesEventService } from 'src/domain/services/addressesEvent.service';
import { UserService } from 'src/domain/services/user.service';

@ApiTags('routes')
@Controller('routes')
export class RouteController {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: typeof User,
    private readonly _service: RouteService,
    private readonly _serviceAddress: AddressService,
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
   * @returns {PaginateResponseDto{}} Returns all routes with theirs pagination
   * @param {PaginateOptions} request
   */
  @ApiOperation({ summary: 'Read all routes' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Routes has been successfully finded.',
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
    options.where = {
      [Op.and]: [
        req.user.role.idCompany && {
          '$address.idCompany$': {
            [Op.eq]: req.user.role.idCompany,
          },
        },
        {
          [Op.or]: [
            {
              state: 2,
            },
          ],
        },
      ],
    };
    options.include = [
      {
        model: Address,
        as: 'address',
      },
    ];
    const routes = await this._service.paginate(options);
    return res.status(HttpStatus.OK).json(routes);
  }

  /**
   *
   * @returns {Route{}} Returns all routes by courier
   * @param {id} request
   */
  @ApiOperation({ summary: 'Search route history' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: Route,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Route doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/history')
  public async findHistoryByCourier(@Response() res, @Query() query) {
    const sqlDates = `SELECT route.assignedDate
    FROM TBL_ROUTE route
      INNER JOIN TBL_MTR_USER user ON route.idUser = user.idUser
    WHERE route.idUser = :idCourier 
    GROUP BY route.assignedDate;`;
    const paramDate = {
      idCourier: Number(query.idCourier),
    };
    const resultDates = await this.getQuery(sqlDates, paramDate);

    const total = [];
    for (let index = 0; index < resultDates.length; index++) {
      const element = resultDates[index];

      const sqlRoute = `SELECT route.idRoute,address.idAddress,address.name,address.direction,address.reference1,address.reference2,address.lat,address.lon,route.state,route.assignedDate,
                      ST_Distance(POINT(address.lat, address.lon), POINT(company.lat, company.lon)) AS distance
                      FROM TBL_ROUTE route
                        INNER JOIN TBL_MTR_USER user ON route.idUser = user.idUser
                        INNER JOIN TBL_MTR_ADDRESS address ON route.idAddress = address.idAddress
                        INNER JOIN TBL_MTR_COMPANY company ON address.idCompany = company.idCompany
                      WHERE route.idUser = :idCourier AND route.assignedDate = :date AND route.state = 2
                      order by distance ASC;`;
      const params = {
        idCourier: Number(query.idCourier),
        date: element.assignedDate,
      };
      const resultRoutes = await this.getQuery(sqlRoute, params);

      const sqlCompany = `SELECT company.* 
                        FROM TBL_MTR_USER user
                          INNER JOIN TBL_MTR_ROLE role ON user.idRole = role.idRole
                            INNER JOIN TBL_MTR_COMPANY company ON role.idCompany = company.idCompany
                        WHERE user.idUser = :idCourier;`;
      const paramCompany = {
        idCourier: Number(query.idCourier),
      };
      const resultCompany = await this.getQuery(sqlCompany, paramCompany);

      total.push({
        date: element.assignedDate,
        company: resultCompany[0],
        route: resultRoutes,
      });
    }

    if (total.length > 0) {
      return res.status(HttpStatus.OK).json(total);
    } else {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Courier routes not found' });
    }
  }

  /**
   *
   * @returns {Route{}} Returns the current route by courier
   */
  @ApiOperation({ summary: 'Search the current route' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: Route,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Route doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/currentRoute')
  public async findCurrentRouteByCourier(@Response() res, @Query() query) {
    const sqlRoute = `SELECT route.idRoute,address.idAddress,address.name,address.direction,address.reference1,address.reference2,address.lat,address.lon,address.state,route.assignedDate,
      ST_Distance(POINT(address.lat, address.lon), POINT(company.lat, company.lon)) AS distance
      FROM TBL_ROUTE route
        INNER JOIN TBL_MTR_USER user ON route.idUser = user.idUser
        INNER JOIN TBL_MTR_ADDRESS address ON route.idAddress = address.idAddress
        INNER JOIN TBL_MTR_COMPANY company ON address.idCompany = company.idCompany
      WHERE route.idUser = :idCourier AND route.assignedDate = :date AND route.state IN (-1, 1)
      order by distance ASC;`;
    const params = {
      idCourier: Number(query.idCourier),
      date: new Date(query.date),
    };
    const result = await this.getQuery(sqlRoute, params);

    const sqlCompany = `SELECT company.* 
    FROM TBL_MTR_USER user
      INNER JOIN TBL_MTR_ROLE role ON user.idRole = role.idRole
        INNER JOIN TBL_MTR_COMPANY company ON role.idCompany = company.idCompany
    WHERE user.idUser = :idCourier;`;
    const paramCompany = {
      idCourier: Number(query.idCourier),
    };
    const resultCompany = await this.getQuery(sqlCompany, paramCompany);

    const sqlZones = `SELECT zone.*
    FROM TBL_MTR_ZONE zone
    WHERE zone.idCity IN (SELECT DISTINCT address.idCity
              FROM TBL_MTR_ADDRESS address
                INNER JOIN TBL_ROUTE route ON address.idAddress = route.idAddress
                        WHERE  (:idCourier = 0 OR route.idUser = :idCourier) AND route.assignedDate = :date
                and address.idCompany = :idCompany)
      AND zone.idCompany = :idCompany`;

    const resultZones = await this.getQuery(sqlZones, {
      ...params,
      idCompany: resultCompany[0].idCompany,
    });

    if (resultCompany && resultZones && result && result.length > 0) {
      return res.status(HttpStatus.OK).json({
        company: resultCompany[0],
        route: result,
        zones: resultZones,
      });
    } else {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Route not found' });
    }
  }

  /**
   *
   * @returns {Route{}} Returns the routes by courier and date
   */
  @ApiOperation({ summary: 'Search the courier(s) routes by date' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: Route,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Route doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/routeByCourier')
  public async findRouteByCourier(
    @Response() res,
    @Query() query,
    @Request() req,
  ) {
    const sqlRoute = `SELECT route.idRoute,address.idAddress,address.name,address.direction,address.reference1,address.reference2,address.clientGuide,address.lat,address.lon,route.state,route.assignedDate,
      ST_Distance(POINT(address.lat, address.lon), POINT(company.lat, company.lon)) AS distance
      FROM TBL_ROUTE route
        INNER JOIN TBL_MTR_USER user ON route.idUser = user.idUser
        INNER JOIN TBL_MTR_ADDRESS address ON route.idAddress = address.idAddress
        INNER JOIN TBL_MTR_COMPANY company ON address.idCompany = company.idCompany
      WHERE (:idCourier = 0 OR route.idUser = :idCourier) AND route.assignedDate = :date AND route.state <> 5 AND (:state = 0 OR route.state = :state)
      order by distance ASC;`;
    const params = {
      idCourier: Number(query.idCourier),
      date: new Date(query.date),
      state: query.state ? Number(query.state) : 0,
    };
    const result = await this.getQuery(sqlRoute, params);

    const sqlCompany = `SELECT company.* 
    FROM TBL_MTR_USER user
      INNER JOIN TBL_MTR_ROLE role ON user.idRole = role.idRole
        INNER JOIN TBL_MTR_COMPANY company ON role.idCompany = company.idCompany
    WHERE user.idUser = :idCourier;`;
    const paramCompany = {
      idCourier: Number(query.idCourier),
    };
    const resultCompany = await this.getQuery(sqlCompany, paramCompany);

    const sqlZones = `SELECT zone.*
    FROM TBL_MTR_ZONE zone
    WHERE zone.idCity IN (SELECT DISTINCT address.idCity
              FROM TBL_MTR_ADDRESS address
                INNER JOIN TBL_ROUTE route ON address.idAddress = route.idAddress
                        WHERE  (:idCourier = 0 OR route.idUser = :idCourier) AND route.assignedDate = :date
                and address.idCompany = :idCompany)
      AND zone.idCompany = :idCompany`;

    const resultZones = await this.getQuery(sqlZones, {
      ...params,
      idCompany: resultCompany[0].idCompany,
    });

    if (resultCompany && resultZones && result && result.length > 0) {
      return res.status(HttpStatus.OK).json({
        company: resultCompany[0],
        route: result,
        zones: resultZones,
      });
    } else {
      return res.status(HttpStatus.OK).json({
        company: [],
        route: [],
        zones: [],
      });
    }
  }

  /**
   *
   * @returns {Route{}} Returns a route by id
   * @param {id} request
   */
  @ApiOperation({ summary: 'Search a route' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: Route,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Route doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  public async findOne(@Response() res, @Param() param) {
    const route = await this._service.findOne({
      where: { idRoute: param.id },
    });

    if (route) {
      return res.status(HttpStatus.OK).json(route);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Route doesn't exist!" });
  }

  /**
   *
   * @returns {Route{}} Returns a new route
   * @param {RouteDto} request
   */
  @ApiOperation({ summary: 'Create route' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: Route,
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
    description: 'Route already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(
    @Response() res,
    @Body() routeDto: RouteDto,
    @Request() req,
  ) {
    let route;
    let response = {};
    response = { ...response, total: routeDto.addressesChecked.length };
    const checkUser = await this.userRepository.findOne({
      where: { idUser: routeDto.idUser },
      attributes: [
        'idUser',
        'firstName',
        'lastName',
        'secondLastName',
        'documentNumber',
        'phone',
      ],
      raw: true,
      nest: true,
    });

    for (let index = 0; index < routeDto.addressesChecked.length; index++) {
      const element = routeDto.addressesChecked[index];
      let objRoute = {};
      objRoute = {
        idAddress: Number(element),
        idUser: routeDto.idUser,
        assignedDate: routeDto.assignedDate,
      };
      route = await this._service.create(objRoute);

      const options = { where: { idAddress: Number(element) } };
      const addressSelected = await this._serviceAddress.findOne({
        where: { idAddress: Number(element) },
        raw: true,
      });
      addressSelected.state = 3;
      const objAddress = await this._serviceAddress.update(
        addressSelected,
        options,
        options,
      );

      const objAddressesEventDto = {
        idAddress: objAddress.idAddress,
        event: 'ASSIGN_ROUTE',
        data: {
          ...objRoute,
          user: {
            idUser: checkUser.idUser,
            firstName: checkUser.firstName,
            lastName: checkUser.lastName,
            secondLastName: checkUser.secondLastName,
            documentNumber: checkUser.documentNumber,
            phone: checkUser.phone,
          },
        },
        idCreationUser: req.user.idUser,
        createdAt: new Date(),
      };

      await this._serviceAddressesEvent.create(objAddressesEventDto);
    }
    const courierSelected = await this._service.findOne({
      where: { idRoute: route.idRoute },
      raw: true,
      nest: true,
      include: [
        {
          model: User,
        },
      ],
    });

    response = { ...response, route };
    response = { ...response, courierSelected };

    return res.status(HttpStatus.OK).json(response);
  }

  /**
   *
   * @returns {Address{}} Returns updated addresses
   * @param {id} request
   * @param {Address} request
   */
  @ApiOperation({ summary: 'Update address' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully updated.',
    type: Route,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Routes don't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Routes exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/changeAllStateToInRoute/')
  public async updateStateToInRoute(
    @Param() param,
    @Response() res,
    @Body() body,
    @Request() req,
  ) {
    const sqlRoutes = `SELECT route.*
      FROM TBL_ROUTE route
        INNER JOIN TBL_MTR_USER user ON route.idUser = user.idUser
        INNER JOIN TBL_MTR_ADDRESS address ON route.idAddress = address.idAddress
        INNER JOIN TBL_MTR_COMPANY company ON address.idCompany = company.idCompany
      WHERE route.idUser = :idCourier AND route.assignedDate = :date AND address.state = 3;`;
    const params = {
      idCourier: Number(body.idCourier),
      date: new Date(body.date),
    };
    const resultRoutes = await this.getQuery(sqlRoutes, params);
    const idAdreesesUpdated = [];

    for (let index = 0; index < resultRoutes.length; index++) {
      const element = resultRoutes[index];
      const options = { where: { idAddress: element.idAddress } };
      const processedAddress = await this._serviceAddress.findOne({
        where: { idAddress: element.idAddress },
        raw: true,
      });
      processedAddress.state = 4;
      await this._serviceAddress.update(processedAddress, options, options);
      idAdreesesUpdated.push(element.idAddress);
      element.state = 1;
      const optionsRoute = { where: { idRoute: element.idRoute } };

      const objAddressesEventDto = {
        idAddress: element.idAddress,
        event: 'CHANGE_STATUS_ROUTE',
        data: element,
        idCreationUser: req.user.idUser,
        createdAt: new Date(),
      };

      await this._serviceAddressesEvent.create(objAddressesEventDto);

      await this._service.update(element, optionsRoute, optionsRoute);
    }

    if (resultRoutes) {
      const addressUpdated = await this._serviceAddress.findAll({
        where: { idAddress: { [Op.in]: idAdreesesUpdated } },
        raw: true,
      });
      return res.status(HttpStatus.OK).json(addressUpdated);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Routes don't exist!" });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/changeCourierToRoute/')
  public async updateCourier(@Response() res, @Body() body, @Request() req) {
    let total = 0;
    let routeSelected;
    let oldUser = null;
    let nameOldUser;
    let routeSelectedNew;
    for (let index = 0; index < body.routesChecked.length; index++) {
      const element = body.routesChecked[index];

      routeSelected = await this._service.findOne({
        where: { idRoute: Number(element) },
        raw: true,
        nest: true,
        include: [
          {
            model: User,
            as: 'courier',
          },
        ],
      });
      console.log(routeSelected);
      nameOldUser =
        routeSelected.courier.firstName + ' ' + routeSelected.courier.lastName;
      if (oldUser == null) oldUser = routeSelected.idUser;
      // if (routeSelected.state == -1) {
      if (body.idUser) routeSelected.idUser = body.idUser;
      if (body.date) routeSelected.assignedDate = body.date;
      if (body.state) routeSelected.state = body.state;
      const objRoute = await this._service.update(
        routeSelected,
        { where: { idRoute: Number(element) } },
        { where: { idRoute: Number(element) } },
      );

      const objAddressesEventDto = {
        idAddress: objRoute.idAddress,
        event: body.idUser
          ? 'CHANGE_ROUTE_COURIER'
          : body.state
          ? 'CHANGE_ROUTE_STATE'
          : 'CHANGE_ROUTE_DATE',
        data: objRoute,
        idCreationUser: req.user.idUser,
        createdAt: new Date(),
      };

      await this._serviceAddressesEvent.create(objAddressesEventDto);

      total = total + 1;
      // }
      routeSelectedNew = await this._service.findOne({
        where: { idRoute: Number(element) },
        raw: true,
        nest: true,
        include: [
          {
            model: User,
            as: 'courier',
          },
        ],
      });
    }

    if (total > 0) {
      return res.status(HttpStatus.OK).json({
        total: total,
        message: 'Routes modified',
        route: routeSelected,
        newUser: body.idUser,
        oldUser: oldUser,
        nameNewUser:
          routeSelected.courier.firstName +
          ' ' +
          routeSelected.courier.lastName,
        nameOldUser:
          routeSelectedNew.courier.firstName +
          ' ' +
          routeSelectedNew.courier.lastName,
        newState: body.state ? true : false,
        state:
          body.state == '-1'
            ? 'Asignado'
            : body.state == '1'
            ? 'Iniciado'
            : body.state == '2'
            ? 'Entregado'
            : 'No entregado',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/changeAllStateToFinish/')
  public async updateStateToFinish(
    @Param() param,
    @Response() res,
    @Body() body,
    @Request() req,
  ) {
    const sqlRoutes = `SELECT route.*
      FROM TBL_ROUTE route
        INNER JOIN TBL_MTR_USER user ON route.idUser = user.idUser
        INNER JOIN TBL_MTR_ADDRESS address ON route.idAddress = address.idAddress
        INNER JOIN TBL_MTR_COMPANY company ON address.idCompany = company.idCompany
      WHERE route.idUser = :idCourier AND route.assignedDate = :date AND address.state IN (5,6);`;
    const params = {
      idCourier: Number(body.idCourier),
      date: new Date(body.date),
    };
    const resultRoutes = await this.getQuery(sqlRoutes, params);
    const idAdreesesUpdated = [];
    for (let index = 0; index < resultRoutes.length; index++) {
      const element = resultRoutes[index];
      idAdreesesUpdated.push(element.idAddress);
      element.state = 2;
      const optionsRoute = { where: { idRoute: element.idRoute } };
      const objAddressesEventDto = {
        idAddress: element.idAddress,
        event: 'CHANGE_STATUS_ROUTE_FINISHED',
        data: element,
        idCreationUser: req.user.idUser,
        createdAt: new Date(),
      };

      await this._serviceAddressesEvent.create(objAddressesEventDto);
      await this._service.update(element, optionsRoute, optionsRoute);
    }

    if (resultRoutes) {
      const addressUpdated = await this._serviceAddress.findAll({
        where: { idAddress: { [Op.in]: idAdreesesUpdated } },
        raw: true,
      });
      return res.status(HttpStatus.OK).json(addressUpdated);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Routes don't exist!" });
  }

  /**
   *
   * @returns {Route{}} Returns the updated routes total
   * @param {Route} request
   */
  @ApiOperation({ summary: 'Update the selected routes state' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully updated.',
    type: Route,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Route doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Route already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/deleteAllSelectedRoutes')
  public async deleteAllSelectedRoutes(
    @Response() res,
    @Body() body,
    @Request() req,
  ) {
    let routeSelected;
    let total = 0;
    for (let index = 0; index < body.routesChecked.length; index++) {
      const element = body.routesChecked[index];
      routeSelected = await this._service.findOne({
        where: { idRoute: Number(element) },
        raw: true,
      });
      if (routeSelected.state == -1) {
        const optionsAddress = {
          where: { idAddress: routeSelected.idAddress },
        };
        const addressSelected = await this._serviceAddress.findOne({
          where: { idAddress: routeSelected.idAddress },
          raw: true,
        });

        addressSelected.state = 1;
        await this._serviceAddress.update(
          addressSelected,
          optionsAddress,
          optionsAddress,
        );

        routeSelected.state = 5; //Canceled
        const objRoute = await this._service.update(
          routeSelected,
          { where: { idRoute: Number(element) } },
          { where: { idRoute: Number(element) } },
        );

        const objAddressesEventDto = {
          idAddress: addressSelected.idAddress,
          event: 'DISASSIGN_ROUTE',
          data: objRoute,
          idCreationUser: req.user.idUser,
          createdAt: new Date(),
        };

        await this._serviceAddressesEvent.create(objAddressesEventDto);

        total = total + 1;
      }
    }

    if (total > 0) {
      return res.status(HttpStatus.OK).json({
        total: total,
        message: 'Proceso exitoso!',
        route: routeSelected,
      });
    }
  }

  /**
   *
   * @returns {Route{}} Returns a updated route
   * @param {id} request
   * @param {Route} request
   */
  @ApiOperation({ summary: 'Update the route state' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully updated.',
    type: Route,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Route doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Route already exists.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Route already started.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/deleteRoute/:id')
  public async deleteRoute(@Param() param, @Response() res, @Body() body) {
    const options = { where: { idRoute: param.id } };
    const routeSelected = await this._service.findOne({
      where: { idRoute: param.id },
      raw: true,
    });
    if (routeSelected.state != -1) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: "Can't change the route because it already started!",
      });
    }

    const optionsAddress = { where: { idAddress: body.idAddress } };
    const addressSelected = await this._serviceAddress.findOne({
      where: { idAddress: body.idAddress },
      raw: true,
    });

    addressSelected.state = 1;
    await this._serviceAddress.update(
      addressSelected,
      optionsAddress,
      optionsAddress,
    );

    body.state = 5; //Canceled
    const route = await this._service.update(body, options, options);

    if (route) {
      return res.status(HttpStatus.OK).json(route);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Route doesn't exist!" });
  }

  /**
   *
   * @returns {Route{}} Returns a updated route
   * @param {id} request
   * @param {Route} request
   */
  @ApiOperation({ summary: 'Update route' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully updated.',
    type: Route,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Route doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Route already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  public async update(@Param() param, @Response() res, @Body() body) {
    const options = { where: { idRoute: param.id } };
    const route = await this._service.update(body, options, options);

    if (route) {
      return res.status(HttpStatus.OK).json(route);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Route doesn't exist!" });
  }
}
