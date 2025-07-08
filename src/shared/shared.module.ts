import { Module } from '@nestjs/common';
import { ImageService } from './services/image.service';
import { LoggingInterceptor } from './interceptors/loggin.interceptor';
import { HttpExceptionFilter } from './filters/http-exeption.filter';
import { LoggerService } from './services/logger.service';

@Module({
  providers: [ImageService, LoggingInterceptor, HttpExceptionFilter,LoggerService],
  exports: [ImageService, LoggingInterceptor, HttpExceptionFilter,LoggerService],
})
export class SharedModule {}
