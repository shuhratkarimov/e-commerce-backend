// src/shared/schema/log.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type LogEntryDocument = LogEntry & Document;

@Schema({ timestamps: true, versionKey: false })
export class LogEntry extends Document {
  @Prop({ required: true })
  level: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: false })
  trace: string;
}

export const LogEntrySchema = SchemaFactory.createForClass(LogEntry);