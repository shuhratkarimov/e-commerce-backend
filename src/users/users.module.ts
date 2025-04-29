import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Users, UserSchema } from "src/shared/schema/users";
import { Likes, LikesSchema } from "src/shared/schema/likes";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UserSchema,
      },
      {
        name: Likes.name,
        schema: LikesSchema,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
