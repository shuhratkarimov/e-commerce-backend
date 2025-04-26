import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Product, ProductDocument } from "src/shared/schema/products";
import { Cart, CartDocument } from "src/shared/schema/cart";

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ) {}

  async create(user: string, products: string[]): Promise<object> {
    try {
      const foundProducts = await this.productModel.find({ _id: { $in: products } });

      if (foundProducts.length !== products.length) {
        throw new NotFoundException("Some products not found!");
      }
      const newCart = await this.cartModel.create({
        user: new Types.ObjectId(user),
        products: products.map(product => new Types.ObjectId(product))});
      return { message: "New cart created!", newCart };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(user: string): Promise<Object> {
    const carts = await this.cartModel.aggregate([
      { $match: { user: new Types.ObjectId(user) } },
      { $unwind: "$products" },
      { $group: {
          _id: { cartId: "$_id", productId: "$products" },
          count: { $sum: 1 },
        }
      },
      { $group: {
          _id: "$_id.cartId",
          products: { $push: { productId: "$_id.productId", count: "$count" } },
        }
      },
      { $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $project: {
          products: 1, 
          "productDetails.name": 1,
          "productDetails.price": 1,
        }
      }
    ]);
    if (!carts.length) {
      throw new HttpException("No products found in carts!", HttpStatus.NOT_FOUND);
    }
    return { userCarts: carts };
  }
  

  async updateCartProducts(
    cartId: string,
    addProducts: string[],
    removeProducts: string[]
  ): Promise<object> {
    const updateData: any = {}; 
    
    if (addProducts) {
      updateData.$push = { products: { $each: addProducts.map((id) => new Types.ObjectId(id)) } };
    }
  
    if (removeProducts) {
      updateData.$pull = { products: { $in: removeProducts.map((id) => new Types.ObjectId(id)) } };
    }
  
    const updatedCart = await this.cartModel.findByIdAndUpdate(
      cartId,
      updateData,
      { new: true }
    );
  
    if (!updatedCart) {
      throw new HttpException("Cart not found!", HttpStatus.NOT_FOUND);
    }
    return { message: "Cart updated!", updatedCart };
  }
  

  async remove(id: string): Promise<object> {
    const deletedCart = await this.cartModel.findByIdAndDelete(id);
    if (!deletedCart) {
      throw new HttpException("Cart not found!", HttpStatus.NOT_FOUND);
    }
    return { message: "Cart deleted!" };
  }
}
