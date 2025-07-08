import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';
import { STATIC_INTEGRAL_PATH, CORS_OPTIONS, API_PREFIX } from './config/constants';
import { GlobalValidationPipe } from './shared/pipes/validation.pipe';
import { LoggingInterceptor } from './shared/interceptors/loggin.interceptor';
import { HttpExceptionFilter } from './shared/filters/http-exeption.filter';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerOptions } from './config/logger.config';

async function bootstrap() {
  dotenv.config();


const app = await NestFactory.create<NestExpressApplication>(AppModule, {
  logger: WinstonModule.createLogger(winstonLoggerOptions),
});


  // Cargar assets estáticos para Flutter
  app.useStaticAssets(STATIC_INTEGRAL_PATH.root, {
    prefix: STATIC_INTEGRAL_PATH.prefix,
  });

  // Configurar CORS
  app.enableCors(CORS_OPTIONS);

  // Prefijo global de API
  app.setGlobalPrefix(API_PREFIX);

  // Configurar pipes y interceptores
  app.useGlobalPipes(GlobalValidationPipe);
  app.useGlobalInterceptors(new LoggingInterceptor());
  // Configurar filtros de excepciones
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT || 3000;
  await app.listen(port,);
  console.log(`Servidor iniciado en http://localhost:${port}`);
}
bootstrap();
