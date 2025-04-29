import { Module } from "@nestjs/common";
import { LikesController } from "./likes.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Product, ProductSchema } from "src/shared/schema/products";
import { Users, UserSchema } from "src/shared/schema/users";
import { Likes, LikesSchema } from "src/shared/schema/likes";
import { LikeService } from "./likes.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Likes.name,
        schema: LikesSchema,
      },
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: Users.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [LikesController],
  providers: [LikeService],
  exports: [],
})
export class LikeModule {}
