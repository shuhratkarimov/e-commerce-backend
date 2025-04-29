import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Likes, LikesDocument } from "../shared/schema/likes";
import { Product, ProductDocument } from "src/shared/schema/products";

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Likes.name) private likeModel: Model<LikesDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(userId: string, productId: string): Promise<object> {
    const foundLike = await this.likeModel.findOne({
      user: userId,
      product: productId,
    });
    if (foundLike) {
      await this.likeModel.findOneAndDelete({
        user: userId,
        product: productId,
      });
      const updatedProduct = await this.productModel.findByIdAndUpdate(
        productId,
        { $inc: { likes: -1 } },
        { new: true, select: "likes" },
      );
      return { message: "Like deleted!", updatedProduct };
    }

    const newLike = await this.likeModel.create({
      user: userId,
      product: productId,
    });
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      productId,
      { $inc: { likes: 1 } },
      { new: true },
    );

    if (!updatedProduct) {
      throw new NotFoundException("Product not found!");
    }
    return {
      message: "Like created!",
      like: newLike,
      productLikes: updatedProduct.likes,
    };
  }

  async findAllLikesByUserId(user: string): Promise<Likes[]> {
    const likes = await this.likeModel.find({ user: user });
    if (!likes.length) {
      throw new HttpException("No likes found!", HttpStatus.NOT_FOUND);
    }
    return likes;
  }
}
