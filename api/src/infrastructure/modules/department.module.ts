import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { LoggerMiddleware } from '../../app/middlewares/logger.middleware';
import { DepartmentController } from '../../app/controllers/department.controller';
import { DepartmentService } from '../../domain/services/department.service';
import { DepartmentProvider } from '../providers/department.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [DepartmentController],
  providers: [DepartmentService, ...DepartmentProvider],
  exports: [...DepartmentProvider],
})
export class DepartmentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('departments');
  }
}
