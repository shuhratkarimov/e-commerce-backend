import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClickPaymentDocument = ClickPayment & Document

@Schema()
export class ClickPayment extends Document {
  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  merchant_trans_id: string;

  @Prop({ default: null })
  click_trans_id: string;

  @Prop({ default: null })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ClickPaymentSchema = SchemaFactory.createForClass(ClickPayment);
