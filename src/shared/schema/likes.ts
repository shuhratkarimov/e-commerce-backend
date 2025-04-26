import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type LikesDocument = Likes & Document

@Schema({ timestamps: true, versionKey: false })
export class Likes extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: "User" })
  user: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: "Product" })
  product: Types.ObjectId;
}

export const LikesSchema = SchemaFactory.createForClass(Likes)
