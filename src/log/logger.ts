// log/logger.ts
import { Injectable, LoggerService } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class CustomLogger implements LoggerService {
  constructor(
    @InjectModel('LogEntry') private readonly logModel: Model<any>,
  ) {}  

  async log(message: string) {
    console.log(`Custom log: ${message}`);
    await this.logModel.create({ level: 'log', message });
  }

  async error(message: string, trace: string | Error) {
    console.error(`Custom error: ${message}\nTrace: ${trace || 'No stack trace'}`);
    await this.logModel.create({ level: 'error', message, trace });
  }

  async warn(message: string) {
    console.warn(`Custom warn: ${message}`);
    await this.logModel.create({ level: 'warn', message });
  }

  async debug(message: string) {
    console.debug(`Custom debug: ${message}`);
    await this.logModel.create({ level: 'debug', message });
  }

  async verbose(message: string) {
    console.log(`Custom verbose: ${message}`);
    await this.logModel.create({ level: 'verbose', message });
  }
}
