import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsNumber } from "class-validator";

export class HandleCallbackDto {
  @ApiProperty({
    description:
      "The action performed by the payment gateway (e.g., payment action)",
    example: "1",
  })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty({
    description: "The id of the click trans",
    example: "1",
  })
  @IsString()
  @IsNotEmpty()
  click_trans_id: string;

  @ApiProperty({
    description: "The id of the click service",
    example: "1",
  })
  @IsString()
  @IsNotEmpty()
  service_id: string;

  @ApiProperty({
    description: "Sign time",
    example: "1",
  })
  @IsString()
  @IsNotEmpty()
  sign_time: string;

  @ApiProperty({
    description: "Sign string",
    example: "1",
  })
  @IsString()
  @IsNotEmpty()
  sign_string: string;

  @ApiProperty({
    description:
      "The error code for the payment request (e.g., success or failure)",
    example: "0",
  })
  @IsString()
  @IsNotEmpty()
  error: string;

  @ApiProperty({
    description: "The unique merchant transaction ID for the payment",
    example: "123456789",
  })
  @IsString()
  @IsNotEmpty()
  merchant_trans_id: string;

  @ApiProperty({
    description: "The signature provided by the gateway for verification",
    example: "abc123",
    required: false,
  })
  @IsOptional()
  @IsString()
  signature?: string;

  @ApiProperty({
    description: "The amount of the transaction",
    example: 1000,
  })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiProperty({
    description: "The currency of the transaction",
    example: "USD",
  })
  @IsString()
  @IsOptional()
  currency?: string;
}
