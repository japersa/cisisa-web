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
import { CountryService } from '../../domain/services/country.service';
import { CountryDto } from '../../domain/dto/country.dto';
import { PaginateOptions } from 'src/domain/services/crud.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Country } from 'src/domain/entities/country.entity';
import { PaginateResponseDto } from 'src/domain/dto/paginated-response.dto';
import { Op, Sequelize } from 'sequelize';

@ApiTags('countries')
@Controller('countries')
export class CountryController {
  constructor(private readonly _service: CountryService) {}

  /**
   *
   * @returns {PaginateResponseDto{}} Returns all countries with theirs pagination
   * @param {PaginateOptions} request
   */
  @ApiOperation({ summary: 'Read all countries' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Countries has been successfully finded.',
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
    const countries = await this._service.paginate({
      page,
      offset,
      order: [['description', 'ASC']],
      where: {
        [Op.and]: [
          search != '' && {
            [Op.or]: [
              {
                idCountry: {
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
    });
    return res.status(HttpStatus.OK).json(countries);
  }

  /**
   *
   * @returns {CountryDto{}} Returns a country by id
   * @param {id} request
   */
  @ApiOperation({ summary: 'Search a country' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: CountryDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Country doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  public async findOne(@Response() res, @Param() param) {
    const country = await this._service.findOne({
      where: { idCountry: param.id },
    });

    if (country) {
      return res.status(HttpStatus.OK).json(country);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Country doesn't exist!" });
  }

  /**
   *
   * @returns {CountryDto{}} Returns a new country
   * @param {CountryDto} request
   */
  @ApiOperation({ summary: 'Create country' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: CountryDto,
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
    description: 'Country already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(@Response() res, @Body() countryDto: CountryDto) {
    countryDto.description = countryDto.description.toUpperCase();
    const countryExists = await this._service.findOne({
      where: { description: countryDto.description.toUpperCase() },
    });
    if (countryExists) {
      return res.status(HttpStatus.FOUND).json({ message: 'Country already exists!' });
    }
    const country = await this._service.create(countryDto);
    return res.status(HttpStatus.OK).json(country);
  }

  /**
   *
   * @returns {CountryDto{}} Returns the modified country
   * @param {id} request
   * @param {CountryDto} request
   */
  @ApiOperation({ summary: 'Change the country state' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record state has been successfully changed.',
    type: CountryDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Country doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/changeState/:id')
  public async changeState(@Param() param, @Response() res, @Body() body) {
    const options = { where: { idCountry: param.id } };
    body = { ...body, isActive: !body.isActive };
    const country = await this._service.update(body, options, options);
    if (country) {
      return res.status(HttpStatus.OK).json(country);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Country doesn't exist!" });
  }

  /**
   *
   * @returns {CountryDto{}} Returns a updated country
   * @param {id} request
   * @param {CountryDto} request
   */
  @ApiOperation({ summary: 'Update country' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully updated.',
    type: CountryDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Country doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Country already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  public async update(@Param() param, @Response() res, @Body() body) {
    body.description = body.description.toUpperCase();
    const countryExists = await this._service.findOne({
      where: { description: body.description.toUpperCase() },
    });
    if (countryExists && param.id != countryExists.idCountry) {
      return res.status(HttpStatus.FOUND).json({ message: 'Country already exists!' });
    }

    const options = { where: { idCountry: param.id } };
    const country = await this._service.update(body, options, options);

    if (country) {
      return res.status(HttpStatus.OK).json(country);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Country doesn't exist!" });
  }
}
