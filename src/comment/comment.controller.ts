import { Controller, Post, Body, Req, Get, Param } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtPayload } from 'jsonwebtoken';
import { decodeAccessToken } from 'src/shared/utility/token-generate';

@ApiTags('Comments')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: 'Create a new comment for a product' })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, validation error',
  })
  @ApiBody({ type: CreateCommentDto })
  @Post()
  async create(@Body() createCommentDto: CreateCommentDto, @Req() req: Request) {
    const decoded = decodeAccessToken(req.cookies.accesstoken) as JwtPayload;
    return this.commentService.create({ ...createCommentDto, userId: decoded.id });
  }

  @ApiOperation({ summary: 'Get all comments for a specific product' })
  @ApiResponse({
    status: 200,
    description: 'List of comments for the product',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  @Get('get_product_comments/:id')
  async getByProduct(@Param('id') productId: string) {
    return this.commentService.getCommentsForProduct(productId);
  }
}