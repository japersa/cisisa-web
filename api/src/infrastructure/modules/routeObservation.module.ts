import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { LoggerMiddleware } from '../../app/middlewares/logger.middleware';
import { RouteObservationController } from '../../app/controllers/routeObservation.controller';
import { RouteObservationService } from '../../domain/services/routeObservation.service';
import { RouteObservationProvider } from '../providers/routeObservation.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [RouteObservationController],
  providers: [RouteObservationService, ...RouteObservationProvider],
  exports: [...RouteObservationProvider],
})
export class RouteObservationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('routeObservations');
  }
}
