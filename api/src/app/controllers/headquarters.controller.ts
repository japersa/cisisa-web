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
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HeadquartersService } from '../../domain/services/headquarters.service';
import { HeadquartersDto } from '../../domain/dto/headquarters.dto';
import { PaginateOptions } from 'src/domain/services/crud.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginateResponseDto } from 'src/domain/dto/paginated-response.dto';
import { Op, Sequelize } from 'sequelize';
import { City } from 'src/domain/entities/city.entity';
import { Company } from 'src/domain/entities/company.entity';

@ApiTags('headquartersses')
@Controller('headquartersses')
export class HeadquartersController {
  constructor(private readonly _service: HeadquartersService) {}

  /**
   *
   * @returns {PaginateResponseDto{}} Returns all headquartersses with theirs pagination
   * @param {PaginateOptions} request
   */
  @ApiOperation({ summary: 'Read all headquartersses' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Headquartersses has been successfully finded.',
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
    const headquartersses = await this._service.paginate({
      page,
      offset,
      order: [['idHeadquarters', 'DESC']],
      where: {
        [Op.and]: [
          search != '' && {
            [Op.or]: [
              {
                idHeadquarters: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                nameHeadquarters: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                description: {
                  [Op.like]: `%${options.search}%`,
                },
              },
              {
                '$city.description$': {
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
          model: City,
          as: 'city',
        },
        {
          model: Company,
          as: 'company',
        },
      ],
    });
    return res.status(HttpStatus.OK).json(headquartersses);
  }

  /**
   *
   * @returns {HeadquartersDto{}} Returns a headquarters by id
   * @param {id} request
   */
  @ApiOperation({ summary: 'Search a headquartersses' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: HeadquartersDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Headquarters doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  public async findOne(@Response() res, @Param() param) {
    const headquarters = await this._service.findOne({
      where: { idHeadquarters: param.id },
      include: [
        {
          model: City,
          as: 'city',
        },
      ],
      raw: true,
      nest: true,
    });

    if (headquarters) {
      return res.status(HttpStatus.OK).json(headquarters);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Headquarters doesn't exist!" });
  }

  /**
   *
   * @returns {HeadquartersDto{}} Returns a new headquarters
   * @param {HeadquartersDto} request
   */
  @ApiOperation({ summary: 'Create headquarters' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: HeadquartersDto,
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
    description: 'Headquarters already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(
    @Response() res,
    @Body() headquartersDto: HeadquartersDto,
  ) {
    const headquartersExists = await this._service.findOne({
      where: {
        nameHeadquarters: headquartersDto.nameHeadquarters,
        idCity: headquartersDto.idCity,
      },
    });
    if (headquartersExists) {
      return res
        .status(HttpStatus.FOUND)
        .json({ message: 'Headquarters already exists!' });
    }
    const headquarters = await this._service.create(headquartersDto);
    return res.status(HttpStatus.OK).json(headquarters);
  }

  /**
   *
   * @returns {HeadquartersDto{}} Returns the modified headquarters
   * @param {id} request
   * @param {HeadquartersDto} request
   */
  @ApiOperation({ summary: 'Change the headquarters state' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record state has been successfully changed.',
    type: HeadquartersDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Headquarters doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/changeState/:id')
  public async changeState(@Param() param, @Response() res, @Body() body) {
    const options = { where: { idHeadquarters: param.id } };
    body = { ...body, isActive: !body.isActive };
    const headquarters = await this._service.update(body, options, options);
    if (headquarters) {
      return res.status(HttpStatus.OK).json(headquarters);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "headquarters doesn't exist!" });
  }

  /**
   *
   * @returns {HeadquartersDto{}} Returns a updated headquarters
   * @param {id} request
   * @param {HeadquartersDto} request
   */
  @ApiOperation({ summary: 'Update headquarters' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully updated.',
    type: HeadquartersDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Headquarters doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Headquarters already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  public async update(@Param() param, @Response() res, @Body() body) {
    const headquartersExists = await this._service.findOne({
      where: { nameHeadquarters: body.nameHeadquarters, idCity: body.idCity },
    });
    if (headquartersExists && param.id != headquartersExists.idHeadquarters) {
      return res
        .status(HttpStatus.FOUND)
        .json({ message: 'Headquarters already exists!' });
    }

    const options = { where: { idHeadquarters: param.id } };
    const headquarters = await this._service.update(body, options, options);

    if (headquarters) {
      return res.status(HttpStatus.OK).json(headquarters);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Headquarters doesn't exist!" });
  }
}
