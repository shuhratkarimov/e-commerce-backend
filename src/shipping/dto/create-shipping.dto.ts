import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateShippingDto {
  @ApiProperty({
    description: "User ID for the shipping",
    type: String,
    example: "12345",
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: "Shipping address",
    type: String,
    example: "123 Main St, Apt 4B",
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: "City of the shipping address",
    type: String,
    example: "New York",
    required: false,
  })
  @IsString()
  city?: string;

  @ApiProperty({
    description: "Postal code of the shipping address",
    type: String,
    example: "10001",
    required: false,
  })
  @IsString()
  postalCode?: string;

  @ApiProperty({
    description: "Country of the shipping address",
    type: String,
    example: "USA",
    required: false,
  })
  @IsString()
  country?: string;
}
