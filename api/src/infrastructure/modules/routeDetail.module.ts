import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { LoggerMiddleware } from '../../app/middlewares/logger.middleware';
import { RouteDetailController } from '../../app/controllers/routeDetail.controller';
import { RouteDetailService } from '../../domain/services/routeDetail.service';
import { RouteDetailProvider } from '../providers/routeDetail.provider';
import { RouteService } from 'src/domain/services/route.service';
import { RouteProvider } from '../providers/route.provider';
import { AddressesEventService } from 'src/domain/services/addressesEvent.service';
import { AddressesEventProvider } from '../providers/addressesEvent.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [RouteDetailController],
  providers: [RouteDetailService, RouteService, AddressesEventService, ...RouteDetailProvider, ...RouteProvider,
    ...AddressesEventProvider,],
  exports: [...RouteDetailProvider],
})
export class RouteDetailModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('routeDetails');
  }
}
