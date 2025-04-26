import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class UpdateUserDto {
    @ApiPropertyOptional({ example: 'shuhrat', description: 'Username of the user' })
    @IsOptional()
    @IsString()
    username?: string

    @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg', description: 'Profile image URL' })
    @IsOptional()
    @IsString()
    image?: string
}
 