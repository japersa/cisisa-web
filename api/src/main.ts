import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedocModule, RedocOptions } from 'nestjs-redoc';

const PORT = process.env.APP_PORT;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api/v1');

  const options = new DocumentBuilder()
    .setTitle('Kiki Logistics')
    .setDescription('Route management Kiki Logistics')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'Authorization',
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);

  const redocOptions: RedocOptions = {
    title: 'API Kiki Logistics',
    logo: {
      url: `https://dev-api.kikilogistics.co/logo.png`,
      backgroundColor: '#FFEF2C',
    },
    sortPropsAlphabetically: true,
    hideDownloadButton: false,
    hideHostname: false,
    noAutoAuth: false,
  };

  //SwaggerModule.setup('docs', app, document);
  await RedocModule.setup('/docs', app, document, redocOptions);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders:
      'Origin,X-Requested-With,Content-Type,Accept,Authorization,authorization,X-Forwarded-for',
  });

  await app.listen(PORT);
}

bootstrap().then(() => {
  const logger: Logger = new Logger('MainApplication');
  logger.debug(`Server started on port ${process.env.APP_HOST}:${PORT}`);
});
