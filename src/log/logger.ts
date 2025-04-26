import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class CustomLogger implements LoggerService {
  log(message: string) {
    console.log(`Custom log: ${message}`);
  }

  error(message: string, trace: string) {
    console.error(`Custom error: ${message}\nTrace: ${trace}`);
  }

  warn(message: string) {
    console.warn(`Custom warn: ${message}`);
  }

  debug(message: string) {
    console.debug(`Custom debug: ${message}`);
  }

  verbose(message: string) {
    console.log(`Custom verbose: ${message}`);
  }
}
