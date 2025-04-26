import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
export class CreateUserDto {
  @ApiProperty({ example: "shuhrat", description: "Username of the user" })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: "shuhratkarimov.dev@gmail.com",
    description: "Email of the user",
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ example: "11111", description: "Password of the user" })
  @IsNotEmpty()
  @IsString()
  password: string;
}
