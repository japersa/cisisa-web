import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserController } from '../../app/controllers/user.controller';
import { UserProvider } from '../providers/user.provider';
import { UserService } from '../../domain/services/user.service';
import { LoggerMiddleware } from '../../app/middlewares/logger.middleware';
import { MailModule } from './mail.module';
import { MailService } from 'src/domain/services/mail.service';

@Module({
  imports: [DatabaseModule, MailModule],
  controllers: [UserController],
  providers: [UserService, MailService, ...UserProvider],
  exports: [...UserProvider],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('users');
  }
}
