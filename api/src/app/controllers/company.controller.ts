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
import { CompanyService } from '../../domain/services/company.services';
import { CompanyDto } from '../../domain/dto/company.dto';
import { PaginateOptions } from 'src/domain/services/crud.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginateResponseDto } from 'src/domain/dto/paginated-response.dto';
import { Op, QueryTypes, Sequelize } from 'sequelize';
import { City } from 'src/domain/entities/city.entity';
import { Headquarters } from 'src/domain/entities/headquarters.entity';

@ApiTags('companies')
@Controller('companies')
export class CompanyController {
  constructor(
    private readonly _service: CompanyService,
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
   * @returns {PaginateResponseDto{}} Returns all companies with theirs pagination
   * @param {PaginateOptions} request
   */
  @ApiOperation({ summary: 'Read all companies' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Companies has been successfully finded.',
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
    const companies = await this._service.paginate({
      page,
      offset,
      order: [['description', 'ASC']],
      where: {
        [Op.and]: [
          search != '' && {
            [Op.or]: [
              {
                idCompany: {
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
                lon: {
                  [Op.like]: `%${options.search}%`,
                },
              },
            ],
          },
        ],
      },
    });
    return res.status(HttpStatus.OK).json(companies);
  }

  /**
   *
   * @returns {CompanyDto{}} Returns a company by user
   */
  @ApiOperation({ summary: 'Search a company' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: CompanyDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Company doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/getByUser')
  public async getByUser(@Response() res, @Param() param, @Request() req) {
    const sqlCompany = `SELECT C.*
    FROM TBL_MTR_USER U
      INNER JOIN TBL_MTR_ROLE R ON U.idRole = R.idRole
      INNER JOIN TBL_MTR_COMPANY C ON R.idCompany = C.idCompany
    WHERE idUser = :idCompany;`;
    const params = {
      idCompany: req.user.role.idCompany,
    };
    const company = await this.getQuery(sqlCompany, params);

    if (company) {
      return res.status(HttpStatus.OK).json(company);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Company doesn't exist!" });
  }

  /**
   *
   * @returns {CompanyDto{}} Returns a company by id
   * @param {id} request
   */
  @ApiOperation({ summary: 'Search a company' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: CompanyDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Company doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  public async findOne(@Response() res, @Param() param) {
    const company = await this._service.findOne({
      where: { idCompany: param.id },
    });

    if (company) {
      return res.status(HttpStatus.OK).json(company);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Company doesn't exist!" });
  }

  /**
   *
   * @returns {CompanyDto{}} Returns a new company
   * @param {CompanyDto} request
   */
  @ApiOperation({ summary: 'Create company' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: CompanyDto,
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
    description: 'Company already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(@Response() res, @Body() companyDto: CompanyDto) {
    const companyExists = await this._service.findOne({
      where: {
        description: companyDto.description,
        lat: companyDto.lat,
        lon: companyDto.lon,
      },
    });
    if (companyExists) {
      return res
        .status(HttpStatus.FOUND)
        .json({ message: 'Company already exists!' });
    }
    const company = await this._service.create(companyDto);
    return res.status(HttpStatus.OK).json(company);
  }

  /**
   *
   * @returns {CompanyDto{}} Returns the modified company
   * @param {id} request
   * @param {CompanyDto} request
   */
  @ApiOperation({ summary: 'Change the company state' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record state has been successfully changed.',
    type: CompanyDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Company doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/changeState/:id')
  public async changeState(@Param() param, @Response() res, @Body() body) {
    const options = { where: { idCompany: param.id } };
    body = { ...body, isActive: !body.isActive };
    const company = await this._service.update(body, options, options);
    if (company) {
      return res.status(HttpStatus.OK).json(company);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Company doesn't exist!" });
  }

  /**
   *
   * @returns {CompanyDto{}} Returns a updated company
   * @param {id} request
   * @param {CompanyDto} request
   */
  @ApiOperation({ summary: 'Update company' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully updated.',
    type: CompanyDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Company doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Company already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  public async update(@Param() param, @Response() res, @Body() body) {
    const companyExists = await this._service.findOne({
      where: {
        description: body.description,
        lat: body.lat,
        lon: body.lon,
      },
    });
    if (companyExists && param.id != companyExists.idCompany) {
      return res
        .status(HttpStatus.FOUND)
        .json({ message: 'Company already exists!' });
    }

    const options = { where: { idCompany: param.id } };
    const company = await this._service.update(body, options, options);

    if (company) {
      return res.status(HttpStatus.OK).json(company);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Company doesn't exist!" });
  }
}
