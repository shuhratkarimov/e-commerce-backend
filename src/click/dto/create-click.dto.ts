import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class HandleCallbackDto {
  @ApiProperty({
    description: "The action performed by the payment gateway",
    example: "1",
  })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty({
    description: "The error code (if any) for the payment request",
    example: "0",
  })
  @IsString()
  @IsNotEmpty()
  error: string;

  @ApiProperty({
    description: "The unique merchant transaction ID",
    example: "123456789",
  })
  @IsString()
  @IsNotEmpty()
  merchant_trans_id: string;

  @ApiProperty({
    description: "The signature provided for verification",
    example: "abc123",
    required: false,
  })
  @IsOptional()
  @IsString()
  signature?: string;
}
