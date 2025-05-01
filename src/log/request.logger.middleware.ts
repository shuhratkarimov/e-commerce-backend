// log/request-logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Logs, LogsDocument } from '../shared/schema/log';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(Logs.name) private readonly logModel: Model<LogsDocument>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    res.on('finish', async () => {
      const responseTime = Date.now() - startTime;

      const logEntry = new this.logModel({
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        headers: req.headers,
        body: req.body,
        query: req.query,
        statusCode: res.statusCode,
        responseTime,
      });

      await logEntry.save();
    });

    next();
  }
}
