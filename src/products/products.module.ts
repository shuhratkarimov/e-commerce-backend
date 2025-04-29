import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductController } from "./products.controller";
import { ProductService } from "./products.service";
import { Product, ProductSchema } from "src/shared/schema/products";
import { Category, CategorySchema } from "src/shared/schema/category";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: Category.name,
        schema: CategorySchema,
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [],
})
export class ProductModule {}
