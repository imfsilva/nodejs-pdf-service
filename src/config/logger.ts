import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

const level = process.env.NODE_ENV === 'development' ? 'debug' : 'info'

export interface Log {
  crit: LogFunc
  error: LogFunc
  warning: LogFunc
  notice: LogFunc
  info: LogFunc
  debug: LogFunc
}

interface LogFunc {
  (message: string, ...meta: unknown[]): Log
}

const logger = winston.createLogger({
  level: level,
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({ filename: './logs/app-%DATE%.log', datePattern: 'DD-MM-YYYY', maxSize: '20m' }),
  ],
})

export function getLogger(): Log {
  return logger
}
