import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNegative, IsNumber, IsString } from "class-validator";

export class VerifyForgotPasswordDto  {
  @ApiProperty({
    example: "shuhratkarimov.dev@gmail.com",
    description: "Email of the user",
  })
  @IsString()
  @IsEmail({}, { message: "Enter a valid email" })
  email: string;

  @ApiProperty({ example: 479351, description: "One time password from email" })
  @IsNumber()
  code: number;

  @ApiProperty({ example: "123456", description: "New password of the user" })
  @IsString()
  newPassword: string;
}