import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ShippingDocument = Shipping & Document;

@Schema({ timestamps: true })
export class Shipping extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  address: string;

  @Prop()
  city: string;

  @Prop()
  postalCode: string;

  @Prop()
  country: string;
}

export const ShippingSchema = SchemaFactory.createForClass(Shipping);
