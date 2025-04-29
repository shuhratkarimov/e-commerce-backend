import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Comment } from "../shared/schema/comment";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto & { userId: string }) {
    const createdComment = new this.commentModel({
      ...createCommentDto,
      createdAt: new Date(),
    });
    return createdComment.save();
  }

  async getCommentsForProduct(productId: string) {
    const comments = await this.commentModel
      .find({ productId })
      .populate("userId");

    if (!comments.length) {
      return {
        message: "No comments for this product yet.",
        averageRating: 0,
        comments: [],
      };
    }

    const totalRating = comments.reduce(
      (sum, comment) => sum + comment.rating,
      0,
    );
    const averageRating = +(totalRating / comments.length).toFixed(2);

    return {
      averageRating,
      comments,
    };
  }
}
