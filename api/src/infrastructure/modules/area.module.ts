import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { LoggerMiddleware } from '../../app/middlewares/logger.middleware';
import { AreaController } from '../../app/controllers/area.controller';
import { AreaService } from '../../domain/services/area.service';
import { AreaProvider } from '../providers/area.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [AreaController],
  providers: [AreaService, ...AreaProvider],
  exports: [...AreaProvider],
})
export class AreaModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('areas');
  }
}
