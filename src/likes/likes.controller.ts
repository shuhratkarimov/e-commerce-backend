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
import {
  decodeAccessToken,
  decodeRefreshToken,
} from "src/shared/utility/token-generate";

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
    const token = request.headers.token || request.cookies?.refreshtoken;

    if (!token) {
      throw new UnauthorizedException("Token not found!");
    }

    const decoded = decodeRefreshToken(token) as jwt.JwtPayload;

    if (decoded) {
      return this.likeService.create(decoded.id, createLikeDto.product);
    }
  }

  @ApiOperation({ summary: "Get all likes for the logged-in user" })
  @ApiResponse({ status: 200, description: "User likes list" })
  @ApiResponse({ status: 401, description: "Unauthorized, token not found" })
  @Get("get_user_likes")
  findAll(@Request() request) {
    const token = request.headers.token || request.cookies?.refreshtoken;

    if (!token) {
      throw new UnauthorizedException("Token not found!");
    }

    const decoded = decodeRefreshToken(token) as jwt.JwtPayload;

    if (!decoded || !decoded.id) {
      throw new UnauthorizedException("Invalid or missing token");
    }

    return this.likeService.findAllLikesByUserId(decoded.id);
  }
}
