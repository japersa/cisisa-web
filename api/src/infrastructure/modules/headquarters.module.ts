import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { LoggerMiddleware } from '../../app/middlewares/logger.middleware';
import { HeadquartersController } from '../../app/controllers/headquarters.controller';
import { HeadquartersService } from '../../domain/services/headquarters.service';
import { HeadquartersProvider } from '../providers/headquarters.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [HeadquartersController],
  providers: [HeadquartersService, ...HeadquartersProvider],
  exports: [...HeadquartersProvider],
})
export class HeadquartersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('headquartersses');
  }
}
