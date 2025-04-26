import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty } from "class-validator";

export class DeleteLikeDto {
  @ApiProperty({
    description: 'The product ID to remove the like from',
    example: '607f1f77bcf86cd799439011',
  })
  @IsNotEmpty()
  @IsMongoId()
  product: string;
}