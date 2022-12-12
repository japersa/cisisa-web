import {
    Controller,
    Post,
    Body,
    UploadedFile,
    UseInterceptors,
    Response,
    UseGuards,
    Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from 'src/domain/services/files.service';
import { JwtAuthGuard } from '../guards/jwt.guard';

@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file) {
        console.log(file);
        return this.filesService.uploadPublicFile(file.buffer, file.originalname);
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    deleteFile(@Body() body) {
        return this.filesService.deletePublicFile(body.filename);
    }
}
