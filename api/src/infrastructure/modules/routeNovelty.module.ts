import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { LoggerMiddleware } from '../../app/middlewares/logger.middleware';
import { RouteNoveltyController } from 'src/app/controllers/routeNovelty.controller';
import { RouteNoveltyService } from 'src/domain/services/routeNovelty.service';
import { RouteNoveltyProvider } from '../providers/routeNovelty.provider';
import { AddressesEventService } from 'src/domain/services/addressesEvent.service';
import { AddressesEventProvider } from '../providers/addressesEvent.provider';
import { RouteProvider } from '../providers/route.provider';
import { RouteService } from 'src/domain/services/route.service';

@Module({
  imports: [DatabaseModule],
  controllers: [RouteNoveltyController],
  providers: [
    RouteNoveltyService,
    AddressesEventService,
    RouteService,
    ...RouteProvider,
    ...AddressesEventProvider,
    ...RouteNoveltyProvider,
  ],
  exports: [...RouteNoveltyProvider],
})
export class RouteNoveltyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('routeNovelties');
  }
}
