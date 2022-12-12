import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { LoggerMiddleware } from '../../app/middlewares/logger.middleware';
import { ZoneController } from '../../app/controllers/zone.controller';
import { ZoneService } from '../../domain/services/zone.service';
import { ZoneProvider } from '../providers/zone.provider';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CityService } from 'src/domain/services/city.service';
import { CityModule } from './city.module';

@Module({
  imports: [
    DatabaseModule,
    MulterModule.register({
      storage: diskStorage({
        destination: 'uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
    CityModule,
  ],
  controllers: [ZoneController],
  providers: [ZoneService, CityService, ...ZoneProvider],
  exports: [...ZoneProvider],
})
export class ZoneModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('zones');
  }
}
