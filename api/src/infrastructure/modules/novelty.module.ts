import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { LoggerMiddleware } from '../../app/middlewares/logger.middleware';
import { NoveltyController } from 'src/app/controllers/novelty.controller';
import { NoveltyService } from 'src/domain/services/novelty.service';
import { NoveltyProvider } from '../providers/novelty.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [NoveltyController],
  providers: [NoveltyService, ...NoveltyProvider],
  exports: [...NoveltyProvider],
})
export class NoveltyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('novelties');
  }
}
