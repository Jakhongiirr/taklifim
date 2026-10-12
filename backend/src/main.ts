import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { applyResponseEnvelope } from './common/http/swagger-envelope';

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = applyResponseEnvelope(
    SwaggerModule.createDocument(app, config),
  );
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));
  const config = app.get(ConfigService);

  // Number of proxy hops to trust when resolving req.ip from X-Forwarded-For.
  app.set('trust proxy', config.getOrThrow<number>('trustProxy'));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableShutdownHooks();
  if (config.get<boolean>('swaggerEnabled')) setupSwagger(app);

  await app.listen(config.getOrThrow<number>('port'));
}
void bootstrap();
