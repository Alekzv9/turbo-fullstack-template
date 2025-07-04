import pino from 'pino';
import { env } from '../env.js';

const loggerOptions: pino.LoggerOptions = {
  // In development, we show everything. In production, we might only show 'info' and above.
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
};

// For development, we use pino-pretty for nice, human-readable output.
if (env.NODE_ENV === 'development') {
  loggerOptions.transport = {
    target: 'pino-pretty',
    options: {
      // Customize pino-pretty options
      colorize: true, // Add colors
      translateTime: 'SYS:standard', // Use a more human-readable time format
      ignore: 'pid,hostname', // Don't show process ID and hostname
    },
  };
}

// Create and export the logger instance
export const logger = pino(loggerOptions);
