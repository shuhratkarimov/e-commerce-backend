import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "./users/users.module";
import { CustomLogger } from "./log/logger";
import { CategoryModule } from "./category/category.module";
import { ProductModule } from "./products/products.module";
import { LikeModule } from "./likes/likes.module";
import { CartModule } from "./cart/cart.module";
import { CommentModule } from "./comment/comment.module";
import { ClickModule } from "./click/click.module";
import { ShippingModule } from "./shipping/shipping.module";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { RedisCacheInterceptor } from "./redis/redis-interceptor";
import { RedisService } from "./redis/redis.service";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { UploadModule } from "./upload/upload.module";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    UsersModule,
    CategoryModule,
    ProductModule,
    LikeModule,
    CartModule,
    CommentModule,
    ClickModule,
    ShippingModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "uploads"),
      serveRoot: "/uploads",
    }),
    UploadModule,
  ],
  controllers: [],
  providers: [
    CustomLogger,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: RedisCacheInterceptor,
    // },
    // RedisService,
  ],
})
export class AppModule {}
