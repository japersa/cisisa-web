import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from '../../app/middlewares/logger.middleware';
import { FilesService } from 'src/domain/services/files.service';
import { FilesController } from 'src/app/controllers/files.controller';

@Module({
  imports: [
  ],
  providers: [FilesService],
  exports: [],
  controllers: [FilesController],
})
export class FilesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('files');
  }
}
