import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { LoggerMiddleware } from '../../app/middlewares/logger.middleware';
import { CompanyController } from '../../app/controllers/company.controller';
import { CompanyService } from '../../domain/services/company.services';
import { CompanyProvider } from '../providers/company.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [CompanyController],
  providers: [CompanyService, ...CompanyProvider],
  exports: [...CompanyProvider],
})
export class CompanyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('companies');
  }
}
