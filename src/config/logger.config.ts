import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import * as path from 'path';

const logDir = path.join(__dirname, '..', '..', 'logs');

export const winstonLoggerOptions: winston.LoggerOptions = {
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    }),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        nestWinstonModuleUtilities.format.nestLike('Backend', {
          prettyPrint: true,
        }),
      ),
    }),
    new winston.transports.File({
      filename: `${logDir}/app-${new Date().toISOString().split('T')[0]}.log`,
      level: 'info',
    }),
  ],
};
