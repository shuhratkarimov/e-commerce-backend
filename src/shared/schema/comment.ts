import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type CommentDocument = Comment & Document;

@Schema()
export class Comment extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: "User" })
  userId: Types.ObjectId;

  @Prop({ required: true })
  productId: string;

  @Prop({ required: true, min: 0, max: 5 })
  rating: number;

  @Prop({ required: true })
  text: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
