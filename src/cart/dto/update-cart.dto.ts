import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsMongoId } from "class-validator";

export class UpdateCartProductsDto {
  @ApiPropertyOptional({ 
    example: ["680a1498d4d8ce6fde1fd101"], 
    description: "Products to be added to the cart (array of product IDs)" 
  })
  @IsArray()
  @IsMongoId({ each: true })
  addProducts: string[];

  @ApiPropertyOptional({ 
    example: ["680a1498d4d8ce6fde1fd101"], 
    description: "Products to be removed from the cart (array of product IDs)" 
  })
  @IsArray()
  @IsMongoId({ each: true })
  removeProducts: string[];
}
