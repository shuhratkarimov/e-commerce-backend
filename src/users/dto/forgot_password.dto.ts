import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class ForgotPasswordDto {
  @ApiProperty({
    example: "shuhratkarimov.dev@gmail.com",
    description: "Email of the user",
  })
  @IsString()
  @IsEmail({}, { message: "Enter a valid email" })
  email: string;
}
