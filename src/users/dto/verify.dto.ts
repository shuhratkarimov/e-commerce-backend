import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class VerifyDto {
  @ApiProperty({
    example: "shuhratkarimov.dev@gmail.com",
    description: "Email of the user",
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ example: 572934, description: "Verification code of the user from email" })
  @IsNotEmpty()
  @IsNumber()
  verificationCode: number;
}
