import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { LoggerMiddleware } from '../../app/middlewares/logger.middleware';
import { ZoneNeighborhoodController } from '../../app/controllers/zone_neighborhood.controller';
import { ZoneNeighborhoodService } from '../../domain/services/zone_neighborhood.service';
import { ZoneNeighborhoodProvider } from '../providers/zone_neighborhood.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [ZoneNeighborhoodController],
  providers: [ZoneNeighborhoodService, ...ZoneNeighborhoodProvider],
  exports: [...ZoneNeighborhoodProvider],
})
export class ZoneNeighborhoodModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('zonesNeighborhoods');
  }
}
