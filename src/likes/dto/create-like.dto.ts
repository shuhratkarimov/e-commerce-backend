import { IsMongoId, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateLikeDto {
  @ApiProperty({
    description: "The product ID that the user likes",
    example: "607f1f77bcf86cd799439011",
  })
  @IsNotEmpty()
  @IsMongoId()
  product: string;
}
