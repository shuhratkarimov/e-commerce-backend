import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true, versionKey: false })
export class Category extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  image: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
