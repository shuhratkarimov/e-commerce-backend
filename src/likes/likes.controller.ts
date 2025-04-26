import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { LikeService } from "./likes.service";
import { CreateLikeDto } from "./dto/create-like.dto";
import { DeleteLikeDto } from "./dto/delete-like.dto";
import * as jwt from "jsonwebtoken";
import { decodeAccessToken } from "src/shared/utility/token-generate";

@ApiTags("Likes")
@Controller("like")
export class LikesController {
  constructor(private readonly likeService: LikeService) {}

  @ApiOperation({ summary: "Create a new like for a product" })
  @ApiResponse({ status: 201, description: "Like created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized, token not found" })
  @ApiBody({ type: CreateLikeDto })
  @Post("add_like")
  async create(@Request() request, @Body() createLikeDto: CreateLikeDto) {
    if (!request.cookies?.accesstoken) {
      throw new UnauthorizedException("Token not found!");
    }
    const decoded = decodeAccessToken(request.cookies.accesstoken) as jwt.JwtPayload;
    if (decoded) {
      return this.likeService.create(decoded.id, createLikeDto.product);
    }
  }

  @ApiOperation({ summary: "Get all likes for the logged-in user" })
  @ApiResponse({ status: 200, description: "User likes list" })
  @ApiResponse({ status: 401, description: "Unauthorized, token not found" })
  @Get("get_user_likes")
  findAll(@Request() request) {
    if (!request.cookies?.accesstoken) {
      throw new UnauthorizedException("Token not found!");
    }
    const decoded = decodeAccessToken(request.cookies.accesstoken) as jwt.JwtPayload;
    return this.likeService.findAllLikesByUserId(decoded.id);
  }
}