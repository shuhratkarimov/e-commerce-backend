import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ProductDocument = Product & Document;

@Schema({ timestamps: true, versionKey: false })
export class Product extends Document {
  @Prop({ required: false })
  name: String;

  @Prop({ required: true })
  brand: String;

  @Prop({ required: false })
  price: Number;

  @Prop({ required: false })
  colors: [String];

  @Prop({ required: false })
  rom: Number;

  @Prop({ required: false })
  screenSize: Number;

  @Prop({ required: false })
  cpu: String;

  @Prop({ required: false })
  cores: Number;

  @Prop({ required: false })
  mainCamera: String;

  @Prop({ required: false })
  frontCamera: Number;

  @Prop({ required: false })
  batteryCapacity: Number;

  @Prop({ required: false })
  description: String;

  @Prop({ required: false })
  freeDelivery: Number;

  @Prop({ required: false })
  inStock: Number;

  @Prop({ required: false })
  guaranteed: Number;

  @Prop({ required: false })
  details: String;

  @Prop({ required: false })
  screenResolution: [Number];

  @Prop({ required: false })
  screenRefreshRate: Number;

  @Prop({ required: false })
  pixelDensity: Number;

  @Prop({ required: false })
  screenType: String;

  @Prop({ required: false })
  protectionClass: Number;

  @Prop({ required: false })
  additionally: String;

  @Prop({ required: false, default: 0 })
  likes: Number;

  @Prop({ required: false })
  images: [String];

  @Prop({ required: true })
  type: String
}

export const ProductSchema = SchemaFactory.createForClass(Product);
