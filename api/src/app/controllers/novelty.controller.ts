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
import { NoveltyService } from 'src/domain/services/novelty.service';
import { NoveltyDto } from 'src/domain/dto/novelty.dto';

@ApiTags('novelties')
@Controller('novelties')
export class NoveltyController {
  constructor(private readonly _service: NoveltyService) {}

  /**
   *
   * @returns {PaginateResponseDto{}} Returns all novelties with theirs pagination
   * @param {PaginateOptions} request
   */
  @ApiOperation({ summary: 'Read all novelties' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Novelties has been successfully finded.',
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
    const novelties = await this._service.paginate({
      page,
      offset,
      order: [['idNovelty', 'ASC']],
      where: {
        [Op.and]: [
          search != '' && {
            [Op.or]: [
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
    });
    return res.status(HttpStatus.OK).json(novelties);
  }

  /**
   *
   * @returns {NoveltyDto{}} Returns a novelty by id
   * @param {id} request
   */
  @ApiOperation({ summary: 'Find a novelty' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: NoveltyDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Novelty doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  public async findOne(@Response() res, @Param() param) {
    const novelty = await this._service.findOne({
      where: { idNovelty: param.id },
    });

    if (novelty) {
      return res.status(HttpStatus.OK).json(novelty);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Novelty doesn't exist!" });
  }

  /**
   *
   * @returns {NoveltyDto{}} Returns a new novelty
   * @param {NoveltyDto} request
   */
  @ApiOperation({ summary: 'Create novelty' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: NoveltyDto,
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
    description: 'Novelty already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(
    @Response() res,
    @Body() noveltyDto: NoveltyDto,
    @Request() req,
  ) {
    const novelty = await this._service.create(noveltyDto);

    if (novelty) {
      return res.status(HttpStatus.OK).json(novelty);
    }
  }

  /**
   *
   * @returns {NoveltyDto{}} Returns the modified novelty
   * @param {id} request
   * @param {NoveltyDto} request
   */
  @ApiOperation({ summary: 'Change the novelty state' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record state has been successfully changed.',
    type: NoveltyDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Novelty doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/changeState/:id')
  public async changeState(@Param() param, @Response() res, @Body() body) {
    const options = { where: { idNovelty: param.id } };
    body = { ...body, isActive: !body.isActive };
    const novelty = await this._service.update(body, options, options);
    if (novelty) {
      return res.status(HttpStatus.OK).json(novelty);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Novelty doesn't exist!" });
  }

  /**
   *
   * @returns {NoveltyDto{}} Returns a novelty updated
   * @param {id} request
   */
  @ApiOperation({ summary: 'Update a novelty' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: NoveltyDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Novelty doesn't exist!",
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
    const options = { where: { idNovelty: param.id } };
    const novelty = await this._service.update(body, options, options);

    if (novelty) {
      return res.status(HttpStatus.OK).json(novelty);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Novelty doesn't exist!" });
  }
}
