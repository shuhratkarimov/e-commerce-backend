import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { LikeService } from "../likes.service";
import { Likes } from "../../shared/schema/likes";
import { Product } from "src/shared/schema/products";
import { NotFoundException, HttpException } from "@nestjs/common";

describe("LikeService", () => {
  let service: LikeService;
  let likeModel: any;
  let productModel: any;

  beforeEach(async () => {
    likeModel = {
      findOne: jest.fn(),
      findOneAndDelete: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
    };

    productModel = {
      findByIdAndUpdate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikeService,
        { provide: getModelToken(Likes.name), useValue: likeModel },
        { provide: getModelToken(Product.name), useValue: productModel },
      ],
    }).compile();

    service = module.get<LikeService>(LikeService);
  });

  describe("create", () => {
    it("should delete like if already exists", async () => {
      likeModel.findOne.mockResolvedValue({ _id: "likeId" });
      likeModel.findOneAndDelete.mockResolvedValue({});
      productModel.findByIdAndUpdate.mockResolvedValue({ likes: 3 });

      const result = await service.create("user123", "product123");

      expect(likeModel.findOne).toHaveBeenCalledWith({
        user: "user123",
        product: "product123",
      });
      expect(likeModel.findOneAndDelete).toHaveBeenCalled();
      expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "product123",
        { $inc: { likes: -1 } },
        { new: true, select: "likes" },
      );
      expect(result).toEqual({
        message: "Like deleted!",
        updatedProduct: { likes: 3 },
      });
    });

    it("should create like if not exists", async () => {
      likeModel.findOne.mockResolvedValue(null);
      likeModel.create.mockResolvedValue({ _id: "newLike" });
      productModel.findByIdAndUpdate.mockResolvedValue({ likes: 5 });

      const result = await service.create("user123", "product123");

      expect(likeModel.create).toHaveBeenCalledWith({
        user: "user123",
        product: "product123",
      });
      expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "product123",
        { $inc: { likes: 1 } },
        { new: true },
      );
      expect(result).toEqual({
        message: "Like created!",
        like: { _id: "newLike" },
        productLikes: 5,
      });
    });

    it("should throw NotFoundException if product not found", async () => {
      likeModel.findOne.mockResolvedValue(null);
      likeModel.create.mockResolvedValue({ _id: "newLike" });
      productModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(service.create("user123", "product123")).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("findAllLikesByUserId", () => {
    it("should return all likes for user", async () => {
      const likes = [{ _id: "like1" }];
      likeModel.find.mockResolvedValue(likes);

      const result = await service.findAllLikesByUserId("user123");

      expect(likeModel.find).toHaveBeenCalledWith({ user: "user123" });
      expect(result).toEqual(likes);
    });

    it("should throw exception if no likes found", async () => {
      likeModel.find.mockResolvedValue([]);

      await expect(service.findAllLikesByUserId("user123")).rejects.toThrow(
        HttpException,
      );
    });
  });
});
