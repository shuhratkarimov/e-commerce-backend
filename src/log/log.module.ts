import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Logs, LogsSchema } from "../shared/schema/log";
import { RequestLoggingMiddleware } from "./request.logger.middleware";
import {
  RATE_LIMIT_LOG_MODEL,
  RateLimitLogSchema,
} from "src/shared/schema/rate-limiter";
import { LogEntry, LogEntrySchema } from "src/shared/schema/log-entry";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Logs.name, schema: LogsSchema },
      { name: RATE_LIMIT_LOG_MODEL, schema: RateLimitLogSchema },
      { name: LogEntry.name, schema: LogEntrySchema },
    ]),
  ],
  providers: [RequestLoggingMiddleware],
  exports: [MongooseModule, RequestLoggingMiddleware],
})
export class LogModule {}
