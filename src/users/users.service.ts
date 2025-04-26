import {
  BadRequestException,
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { UserDocument, Users } from "../shared/schema/users";
import { Model } from "mongoose";
import {
  comparePassword,
  generateHashPassword
} from "../shared/utility/password-manager";
import sendVerificationEmail from "src/shared/utility/email-service";
import { LoginDto } from "./dto/login-dto";
import { VerifyDto } from "./dto/verify.dto";
import { ResponseMessage } from "./users.controller";
import {
  decodeRefreshToken,
  generateAccessToken,
  generateRefreshToken
} from "../shared/utility/token-generate";
import { Request, Response } from "express";
import { ForgotPasswordDto } from "./dto/forgot_password.dto";
import sendForgotPasswordEmail from "../shared/utility/forgot_password_email_sender";
import { VerifyForgotPasswordDto } from "./dto/verify_forgot_password.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Likes, LikesDocument } from "src/shared/schema/likes";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Likes.name) private readonly likeModel: Model<LikesDocument>
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      createUserDto.password = await generateHashPassword(createUserDto.password);
      const user = await this.userModel.findOne({ email: createUserDto.email });

      if (user) {
        throw new UnauthorizedException("User already exists!");
      }

      const otp = +Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join("");
      const otpExpiryTime = new Date();
      otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 3);

      await this.userModel.create({
        ...createUserDto,
        otp,
        otpExpiryTime
      });

      sendVerificationEmail(createUserDto.username, createUserDto.email, otp);

      return {
        success: true,
        message: "Successfully registered!",
        result: `Verification code sent to your email: ${createUserDto.email}`
      };
    } catch (error) {
      console.error("Create user error:", error);
      throw new BadRequestException(error || "Error in registering!");
    }
  }

  async verify(@Body() verifyDto: VerifyDto): Promise<ResponseMessage> {
    try {
      const { email, verificationCode } = verifyDto;
      const foundUser = await this.userModel.findOne({ email });

      if (!foundUser) {
        throw new NotFoundException("User not found!");
      }

      if (
        new Date() <= foundUser.otpExpiryTime &&
        Number(verificationCode) === foundUser.otp
      ) {
        await this.userModel.updateOne(
          { _id: foundUser._id },
          { isVerified: true, otp: 0 }
        );
        return { message: "You successfully verified!" };
      } else {
        throw new BadRequestException("Verification code is invalid or expired!");
      }
    } catch (error) {
      console.error("Verify error:", error);
      throw new BadRequestException(error.message || "Error on verifying!");
    }
  }

  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<any> {
    try {
      const { email, password } = loginDto;
      const foundUser: any = await this.userModel.findOne({ email });

      if (!foundUser) {
        throw new NotFoundException("User not found!");
      }

      const checkPassword = await comparePassword(password, foundUser.password);
      if (!checkPassword) {
        throw new UnauthorizedException("Invalid password");
      }

      const accesstoken = generateAccessToken(foundUser._id, foundUser.type);
      const refreshtoken = generateRefreshToken(foundUser._id, foundUser.type);

      if (foundUser.isVerified) {
        res.cookie("accesstoken", accesstoken, {
          httpOnly: true,
          maxAge: 15 * 60 * 1000,
        });
        res.cookie("refreshtoken", refreshtoken, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json({ message: "You successfully logged in!" });
      } else {
        return res.json({ message: "Your email did not verified yet!" });
      }
    } catch (error) {
      console.error("Login error:", error);
      throw new HttpException(error.message || "Server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post("forgot_password")
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<ResponseMessage> {
    try {
      const { email } = forgotPasswordDto;
      const foundUser = await this.userModel.findOne({ email });

      if (!foundUser) {
        throw new BadRequestException("User not found!");
      }

      if (!foundUser.isVerified) {
        throw new BadRequestException("Your email is not verified!");
      }

      const randomCode = +Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)).join("");
      await sendForgotPasswordEmail(foundUser.username, email, randomCode);

      foundUser.otpExpiryTime = new Date(Date.now() + 3 * 60 * 1000);
      foundUser.otp = randomCode;
      foundUser.attempts = 0;
      await foundUser.save();

      return { message: `A code was sent to recover password to ${email} email!` };
    } catch (error) {
      console.error("Forgot password error:", error);
      throw new BadRequestException(error.message || "Error in refreshing password!");
    }
  }

  async verifyForgotPassword(@Body() data: VerifyForgotPasswordDto): Promise<ResponseMessage> {
    try {
      const { email, code, newPassword } = data;
      const foundUser = await this.userModel.findOne({ email });

      if (!foundUser) {
        throw new NotFoundException("User not found!");
      }

      if (
        Date.now() <= new Date(foundUser.otpExpiryTime).getTime() &&
        code === foundUser.otp
      ) {
        const encodedPassword = await generateHashPassword(newPassword);
        await this.userModel.updateOne(
          { email },
          { otp: null, password: encodedPassword }
        );
        return { message: "Otp verified and password renewed!" };
      } else {
        foundUser.attempts += 1;
        if (foundUser.attempts > 3) {
          foundUser.otpExpiryTime = new Date(Date.now() + 15 * 60 * 1000);
          foundUser.attempts = 0;
          await foundUser.save();
          throw new BadRequestException("You did so many wrong attempts! Please try again later...");
        } else {
          await foundUser.save();
          throw new BadRequestException("Code is wrong or time is expired!");
        }
      }
    } catch (error) {
      console.error("Verify forgot password error:", error);
      throw new BadRequestException(error.message || "Error in verifying forgot password code");
    }
  }

  async logout(@Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const token = req.cookies.refreshtoken;
      if (!token) {
        throw new UnauthorizedException("Token not found!");
      }

      const decoded = decodeRefreshToken(token);
      if (!decoded) {
        throw new UnauthorizedException("Token not as required!");
      }

      res.clearCookie("accesstoken", { httpOnly: true });
      res.clearCookie("refreshtoken", { httpOnly: true });

      return res.json({ message: "You logged out" });
    } catch (error) {
      console.error("Logout error:", error);
      throw new UnauthorizedException(error.message || "Error in logging out!");
    }
  }

  async updateUser(user: string, updateUserDto: UpdateUserDto): Promise<Object>{
    try {
      await this.userModel.findByIdAndUpdate(user, updateUserDto)
      const updatedUser = await this.userModel.findById(user).select(["username", "email", "image"])
      return {message: "User profile updated!", updatedUser: updatedUser}
    } catch (error) {
      console.error("UpdateProfile error:", error);
      throw new UnauthorizedException(error.message || "Error in updating profile!");
    }
  }

  async getUserInfo(user: string): Promise<Object>{
    try {
      const userData = await this.userModel.findById(user).select(["username", "email", "image"])
      return {userData: userData}
    } catch (error) {
      console.error("User info getting error:", error);
      throw new UnauthorizedException(error.message || "Error in getting user info!");
    }
  }
}
