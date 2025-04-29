import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  UnauthorizedException,
  Request,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { VerifyDto } from "./dto/verify.dto";
import { LoginDto } from "./dto/login-dto";
import { ForgotPasswordDto } from "./dto/forgot_password.dto";
import { VerifyForgotPasswordDto } from "./dto/verify_forgot_password.dto";
import { Request as ExpressRequest, Response } from "express";
import { UpdateUserDto } from "./dto/update-user.dto";
import {
  decodeAccessToken,
  decodeRefreshToken,
} from "src/shared/utility/token-generate";
import { JwtPayload } from "jsonwebtoken";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

export class ResponseMessage {
  message: string;
}
@ApiTags("Users")
@Controller("user")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("register")
  @ApiOperation({ summary: "Register new user" })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: "User successfully registered" })
  @Post("register")
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post("resend_verification_code")
  @ApiOperation({ summary: "Resend verification code" })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: "Verification code resent" })
  async resendVerificationCode(
    @Body() resendVerificationCode: ForgotPasswordDto,
  ): Promise<object> {
    return await this.usersService.resendVerificationCode(
      resendVerificationCode,
    );
  }

  @Post("verify")
  @ApiOperation({ summary: "Verify user via OTP" })
  @ApiBody({ type: VerifyDto })
  @ApiResponse({ status: 200, description: "User verified successfully" })
  async verify(@Body() verifyDto: VerifyDto): Promise<ResponseMessage> {
    return await this.usersService.verify(verifyDto);
  }

  @Post("login")
  @ApiOperation({ summary: "Login user" })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: "User logged in and token set in cookie",
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res() res: Response,
  ): Promise<ResponseMessage> {
    try {
      return await this.usersService.login(loginDto, res);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Post("forgot_password")
  @ApiOperation({ summary: "Send OTP for forgot password" })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: "OTP sent to user phone/email" })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ResponseMessage> {
    try {
      return await this.usersService.forgotPassword(forgotPasswordDto);
    } catch (error) {
      console.error(error);
      throw new Error("Forgot password process failed");
    }
  }

  @Post("verify_forgot_password")
  @ApiOperation({ summary: "Verify OTP for password reset" })
  @ApiBody({ type: VerifyForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: "OTP verified and password updated",
  })
  async verifyForgotPassword(
    @Body() verifyForgotPasswordDto: VerifyForgotPasswordDto,
  ): Promise<ResponseMessage> {
    try {
      return await this.usersService.verifyForgotPassword(
        verifyForgotPasswordDto,
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  @Post("logout")
  @ApiOperation({ summary: "Logout user and clear token" })
  @ApiResponse({ status: 200, description: "User logged out" })
  async logout(
    @Req() req: ExpressRequest,
    @Res() res: Response,
  ): Promise<ResponseMessage> {
    try {
      return await this.usersService.logout(req, res);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Post("update_profile")
  @ApiOperation({ summary: "Update user profile" })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: "User profile updated" })
  @Post("update_profile")
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Request() request,
  ): Promise<object> {
    try {
      const token = request.headers.token || request.cookies?.refreshtoken;

      if (!token) {
        throw new UnauthorizedException("Token not found!");
      }

      const decoded = decodeRefreshToken(token) as JwtPayload;

      if (!decoded || !decoded.id) {
        throw new UnauthorizedException("Invalid or missing token");
      }
      return await this.usersService.updateUser(decoded.id, updateUserDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get("get_user_info")
  @ApiOperation({ summary: "Get logged in user info" })
  @ApiResponse({ status: 200, description: "Returns user info" })
  async getUserInfo(@Request() request): Promise<object> {
    try {
      const token = request.headers.token || request.cookies?.refreshtoken;

      if (!token) {
        throw new UnauthorizedException("Token not found!");
      }

      const decoded = decodeRefreshToken(token) as JwtPayload;

      if (!decoded || !decoded.id) {
        throw new UnauthorizedException("Invalid or missing token");
      }
      return await this.usersService.getUserInfo(decoded.id);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Post("refresh")
  @ApiOperation({ summary: "Refreshes access token" })
  @ApiResponse({
    status: 200,
    description: "Uses refresh token and renewes access token",
  })
  async getNewAccessToken(
    @Req() request: ExpressRequest,
    @Res() res: Response,
  ): Promise<object> {
    try {
      return await this.usersService.getNewAccessToken(request, res);
    } catch (error) {
      throw new Error(error);
    }
  }
}
