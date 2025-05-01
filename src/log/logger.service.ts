import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RateLimitLog } from 'src/shared/schema/rate-limiter';

@Injectable()
export class LoggerService {
  constructor(
    @InjectModel('Log') private readonly logModel: Model<any>,
    private readonly rateLimitLog: Model<RateLimitLog>
  ) {}

  async logRequest(data: any) {
    try {
      await this.logModel.create(data);
    } catch (error) {
      console.error('Log yozishda xatolik:', error);
    }
  }
}
