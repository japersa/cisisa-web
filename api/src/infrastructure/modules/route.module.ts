import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { LoggerMiddleware } from '../../app/middlewares/logger.middleware';
import { RouteController } from '../../app/controllers/route.controller';
import { RouteService } from '../../domain/services/route.service';
import { RouteProvider } from '../providers/route.provider';
import { AddressService } from 'src/domain/services/address.service';
import { AddressModule } from './address.module';
import { AddressesEventService } from 'src/domain/services/addressesEvent.service';
import { AddressesEventProvider } from '../providers/addressesEvent.provider';
import { UserProvider } from '../providers/user.provider';

@Module({
  imports: [DatabaseModule, AddressModule],
  controllers: [RouteController],
  providers: [
    RouteService,
    AddressService,
    AddressesEventService,
    ...AddressesEventProvider,
    ...RouteProvider,
    ...UserProvider
  ],
  exports: [...RouteProvider],
})
export class RouteModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('routes');
  }
}
