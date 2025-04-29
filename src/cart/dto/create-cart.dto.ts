import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsMongoId } from "class-validator";
export class CreateCartDto {
  @ApiProperty({
    example: [
      "680a1498d4d8ce6fde1fd101",
      "680a1715be9575063cd3f694",
      "680a1a47bf4373d1006923e6",
    ],
    description: "Products in cart (array)",
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  products: string[];
}
