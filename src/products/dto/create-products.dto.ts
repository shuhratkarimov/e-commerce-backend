import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    type: String,
    example: 'iPhone 13',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Brand of the product',
    type: String,
    example: 'Apple',
  })
  @IsNotEmpty()
  @IsString()
  brand: string;

  @ApiProperty({
    description: 'Price of the product',
    type: Number,
    example: 999,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Colors available for the product',
    type: [String],
    example: ['Red', 'Blue', 'Black'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  colors?: string[];

  @ApiProperty({
    description: 'Amount of ROM (storage) of the product',
    type: Number,
    example: 128,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  rom?: number;

  @ApiProperty({
    description: 'Screen size of the product',
    type: Number,
    example: 6.1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  screenSize?: number;

  @ApiProperty({
    description: 'CPU model of the product',
    type: String,
    example: 'A15 Bionic',
    required: false,
  })
  @IsOptional()
  @IsString()
  cpu?: string;

  @ApiProperty({
    description: 'Number of CPU cores of the product',
    type: Number,
    example: 6,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  cores?: number;

  @ApiProperty({
    description: 'Main camera resolution (in MP) of the product',
    type: String,
    example: '12MP Dual Camera',
    required: false,
  })
  @IsOptional()
  @IsString()
  mainCamera?: string;

  @ApiProperty({
    description: 'Front camera resolution (in MP) of the product',
    type: Number,
    example: 12,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  frontCamera?: number;

  @ApiProperty({
    description: 'Battery capacity of the product (in mAh)',
    type: Number,
    example: 2815,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  batteryCapacity?: number;

  @ApiProperty({
    description: 'Detailed description of the product',
    type: String,
    example: 'Latest Apple iPhone with improved performance and camera',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Free delivery option (if applicable)',
    type: Number,
    example: 1, // 1 = free delivery, 0 = no free delivery
    required: false,
  })
  @IsOptional()
  @IsNumber()
  freeDelivery?: number;

  @ApiProperty({
    description: 'Number of products in stock',
    type: Number,
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  inStock: number;

  @ApiProperty({
    description: 'Warranty duration (in months)',
    type: Number,
    example: 12,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  guaranteed?: number;

  @ApiProperty({
    description: 'Additional details about the product',
    type: String,
    example: 'Includes charger and accessories',
    required: false,
  })
  @IsOptional()
  @IsString()
  details?: string;

  @ApiProperty({
    description: 'Screen resolution of the product (width and height)',
    type: [Number],
    example: [1170, 2532],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  screenResolution?: number[];

  @ApiProperty({
    description: 'Screen refresh rate (Hz) of the product',
    type: Number,
    example: 60,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  screenRefreshRate?: number;

  @ApiProperty({
    description: 'Pixel density (PPI) of the product',
    type: Number,
    example: 460,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  pixelDensity?: number;

  @ApiProperty({
    description: 'Screen type of the product',
    type: String,
    example: 'OLED',
    required: false,
  })
  @IsOptional()
  @IsString()
  screenType?: string;

  @ApiProperty({
    description: 'Protection class of the product (IP rating)',
    type: Number,
    example: 68,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  protectionClass?: number;

  @ApiProperty({
    description: 'Additional features or accessories for the product',
    type: String,
    example: 'Includes wireless charger',
    required: false,
  })
  @IsOptional()
  @IsString()
  additionally?: string;

  @ApiProperty({
    description: 'Number of likes the product has',
    type: String,
    example: '500',
    required: false,
  })
  @IsOptional()
  @IsString()
  likes?: number;

  @ApiProperty({
    description: 'List of image URLs for the product',
    type: [String],
    example: ['http://example.com/image1.jpg'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiProperty({
    description: 'Type/category of the product',
    type: String,
    example: 'Smartphone',
  })
  @IsNotEmpty()
  @IsString()
  type: string;
}