// src/shared/schema/log.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type LogsDocument = Logs & Document;

@Schema({ timestamps: true, versionKey: false })
export class Logs extends Document {
  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  ip: string;

  @Prop({ type: MongooseSchema.Types.Mixed, default: null }) // Use Mixed for generic objects
  headers: Record<string, any>;

  @Prop({ type: MongooseSchema.Types.Mixed, default: null }) // Use Mixed for generic objects
  body: Record<string, any>;

  @Prop({ type: MongooseSchema.Types.Mixed, default: null }) // Use Mixed for generic objects
  query: Record<string, any>;

  @Prop({ type: Number, default: null }) // Explicitly define as Number
  statusCode: number;

  @Prop({ type: Number, default: null }) // Explicitly define as Number
  responseTime: number;
}

export const LogsSchema = SchemaFactory.createForClass(Logs);