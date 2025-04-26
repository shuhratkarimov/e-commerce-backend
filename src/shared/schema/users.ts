import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = Users & Document;

export enum userTypes {
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  TEACHER = "teacher",
  STUDENT = "student",
  USER = "user"
}

@Schema({ timestamps: true, versionKey: false })
export class Users extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: false,
    enum: [
      userTypes.SUPERADMIN,
      userTypes.ADMIN,
      userTypes.TEACHER,
      userTypes.STUDENT,
      userTypes.USER
    ],
    default: "user",
  })
  type: string;

  @Prop({default: false})
  isVerified: boolean

  @Prop({default: null})
  otp: number

  @Prop({default: null})
  otpExpiryTime: Date

  @Prop({default: 0})
  attempts: number

  @Prop({default: null})
  allowedTime: Date

  @Prop({default: null})
  image: String
}

export const UserSchema = SchemaFactory.createForClass(Users)
