import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from '../shared/schema/category';
import { Product, ProductSchema } from 'src/shared/schema/products';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Users, UserSchema } from 'src/shared/schema/users';
import { Cart, CartSchema } from 'src/shared/schema/cart';

@Module({
  imports: [MongooseModule.forFeature([{
    name: Cart.name,
    schema: CartSchema
  },
  {
    name: Product.name,
    schema: ProductSchema
  }
])], 
  controllers: [CartController],
  providers: [CartService],
  exports: [], 
})
export class CartModule {}
