import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { LoggerMiddleware } from '../../app/middlewares/logger.middleware';
import { AddressController } from '../../app/controllers/address.controller';
import { AddressService } from '../../domain/services/address.service';
import { AddressProvider } from '../providers/address.provider';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CityService } from 'src/domain/services/city.service';
import { CityController } from 'src/app/controllers/city.controller';
import { CityProvider } from '../providers/city.provider';
import { CityModule } from './city.module';
import { NeighborhoodModule } from './neighborhood.module';
import { NeighborhoodService } from 'src/domain/services/neighborhood.service';
import { NeighborhoodProvider } from '../providers/neighborhood.provider';
import { ZoneNeighborhoodService } from 'src/domain/services/zone_neighborhood.service';
import { ZoneNeighborhoodModule } from './zone_neighborhood.module';
import { ZoneModule } from './zone.module';
import { ZoneService } from 'src/domain/services/zone.service';
import { AddressesEventService } from 'src/domain/services/addressesEvent.service';
import { AddressesEventProvider } from '../providers/addressesEvent.provider';

@Module({
  imports: [
    DatabaseModule,
    CityModule,
    NeighborhoodModule,
    ZoneNeighborhoodModule,
    ZoneModule,
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
  ],
  controllers: [AddressController],
  providers: [
    AddressService,
    CityService,
    NeighborhoodService,
    ZoneNeighborhoodService,
    ZoneService,
    AddressesEventService,
    ...AddressesEventProvider,
    ...NeighborhoodProvider,
    ...CityProvider,
    ...AddressProvider,
  ],
  exports: [...AddressProvider],
})
export class AddressModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('addresses');
  }
}
