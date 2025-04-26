import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryDto {
  @ApiProperty({ example: "Computers", description: "Category title" })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: "https://example.com", description: "Image URL for the category" })
  @IsNotEmpty()
  @IsString()
  image: string;
}

