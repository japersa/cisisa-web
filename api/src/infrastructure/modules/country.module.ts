import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { LoggerMiddleware } from '../../app/middlewares/logger.middleware';
import { CountryController } from '../../app/controllers/country.controller';
import { CountryService } from '../../domain/services/country.service';
import { CountryProvider } from '../providers/country.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [CountryController],
  providers: [CountryService, ...CountryProvider],
  exports: [...CountryProvider],
})
export class CountryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('countries');
  }
}
