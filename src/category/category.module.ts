import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from '../shared/schema/category';
import { CategoryService } from './category.service';
import { Product, ProductSchema } from 'src/shared/schema/products';

@Module({
  imports: [MongooseModule.forFeature([{
    name: Category.name,
    schema: CategorySchema
  },
  {
    name: Product.name,
    schema: ProductSchema
  }
])], 
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [], 
})
export class CategoryModule {}
