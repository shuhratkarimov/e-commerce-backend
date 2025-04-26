import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type CartDocument = Cart & Document

@Schema({ timestamps: true, versionKey: false })
export class Cart extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: "User" })
  user: Types.ObjectId;

  @Prop({ required: true, type: [Types.ObjectId], ref: "Product" })
  products: Types.ObjectId[];
}

export const CartSchema = SchemaFactory.createForClass(Cart)
