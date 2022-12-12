import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { LoggerMiddleware } from '../../app/middlewares/logger.middleware';
import { CityController } from '../../app/controllers/city.controller';
import { CityService } from '../../domain/services/city.service';
import { CityProvider } from '../providers/city.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [CityController],
  providers: [CityService, ...CityProvider],
  exports: [...CityProvider],
})
export class CityModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('cities');
  }
}
