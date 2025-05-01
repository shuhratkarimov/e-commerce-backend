import { Schema, Document } from 'mongoose';

export interface RateLimitLog extends Document {
  ip: string;
  route: string;
  userAgent: string;
  message: string;
  timestamp?: Date;
}

export const RateLimitLogSchema = new Schema({
  ip: { type: String, required: true },
  route: { type: String, required: true },
  userAgent: { type: String, required: false },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const RATE_LIMIT_LOG_MODEL = 'RateLimitLog';