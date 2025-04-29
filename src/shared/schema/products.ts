import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ProductDocument = Product & Document;

@Schema({ timestamps: true, versionKey: false })
export class Product extends Document {
  @Prop({ required: false })
  name: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: false })
  price: number;

  @Prop({ required: false })
  colors: [string];

  @Prop({ required: false })
  rom: number;

  @Prop({ required: false })
  screenSize: number;

  @Prop({ required: false })
  cpu: string;

  @Prop({ required: false })
  cores: number;

  @Prop({ required: false })
  mainCamera: string;

  @Prop({ required: false })
  frontCamera: number;

  @Prop({ required: false })
  batteryCapacity: number;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false })
  freeDelivery: number;

  @Prop({ required: false })
  inStock: number;

  @Prop({ required: false })
  guaranteed: number;

  @Prop({ required: false })
  details: string;

  @Prop({ required: false })
  screenResolution: [number];

  @Prop({ required: false })
  screenRefreshRate: number;

  @Prop({ required: false })
  pixelDensity: number;

  @Prop({ required: false })
  screenType: string;

  @Prop({ required: false })
  protectionClass: number;

  @Prop({ required: false })
  additionally: string;

  @Prop({ required: false, default: 0 })
  likes: number;

  @Prop({ required: false })
  images: [string];

  @Prop({ required: true })
  type: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
