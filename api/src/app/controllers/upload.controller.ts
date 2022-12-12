import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Response,
  HttpStatus,
  Request,
  Get,
  Param,
  Res,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../guards/jwt.guard';

@Controller('uploads')
export class UploadController {
  constructor(
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file, @Response() res) {
    console.log(file);
    res.status(HttpStatus.OK).json(file);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/multiple')
  @UseInterceptors(AnyFilesInterceptor())
  public async uploadFiles(@UploadedFiles() files, @Response() res) {
    console.log(files);
    res.status(HttpStatus.OK).json(files);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':fileName')
  public async getFile(@Param('fileName') fileName, @Res() res, @Request() req,): Promise<any> {
    return res.sendFile(fileName, { root: 'uploads' }, (err) => {
      if (err) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'The file does not exists' });
      }
    });
  }
}
