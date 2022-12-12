import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { LoggerMiddleware } from '../../app/middlewares/logger.middleware';
import { AddressesEventController } from 'src/app/controllers/addressesEvent.controller';
import { AddressesEventService } from 'src/domain/services/addressesEvent.service';
import { AddressesEventProvider } from '../providers/addressesEvent.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [AddressesEventController],
  providers: [AddressesEventService, ...AddressesEventProvider],
  exports: [...AddressesEventProvider],
})
export class AddressesEventModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('addressesEvents');
  }
}
