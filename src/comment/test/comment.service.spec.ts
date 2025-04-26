import { Test, TestingModule } from "@nestjs/testing";
import { CommentService } from "../comment.service";
import { getModelToken } from "@nestjs/mongoose";
import { Comment } from "../..//shared/schema/comment";
import { Model } from "mongoose";
import { CreateCommentDto } from "../dto/create-comment.dto";

describe("CommentService", () => {
  let service: CommentService;
  let model: Model<Comment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getModelToken(Comment.name),
          useValue: {
            new: jest.fn().mockResolvedValue({}),
            constructor: jest.fn().mockResolvedValue({}),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    model = module.get<Model<Comment>>(getModelToken(Comment.name));
  });

  it("should create a new comment", async () => {
    const createCommentDto: CreateCommentDto = {
      userId: "680a4c048756a89a1571d709",
      productId: "product123",
      rating: 5,
      text: "Great product!",
    };
  
    const mockSavedComment = {
      ...createCommentDto,
      _id: "mockedId",
    };
  
    const saveMock = jest.fn().mockResolvedValue(mockSavedComment);
    const mockCommentInstance = { save: saveMock };
    const modelSpy = jest.spyOn(service['commentModel'], 'constructor' as any).mockImplementation(() => mockCommentInstance);
  
    const result = await service.create({
      ...createCommentDto,
      userId: "680a4c048756a89a1571d709",
    });
  
    expect(saveMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockSavedComment);
    expect(modelSpy).toHaveBeenCalled();
  });
  

  it("should get comments for a product", async () => {
    const productId = "product123";
    const comments = [
      { rating: 5, content: "Great product!" },
      { rating: 4, content: "Good product" },
    ];

    const findComments = jest.fn().mockResolvedValue(comments);

    model.find = findComments;

    const result = await service.getCommentsForProduct(productId);

    expect(findComments).toHaveBeenCalledWith({ productId });
    expect(result.comments.length).toBeGreaterThan(0);
    expect(result.averageRating).toBe(4.5);
  });

  it("should return message if no comments exist for a product", async () => {
    const productId = "product123";
    const findComments = jest.fn().mockResolvedValue([]);

    model.find = findComments;

    const result = await service.getCommentsForProduct(productId);

    expect(result.message).toBe("No comments for this product yet.");
    expect(result.comments).toEqual([]);
    expect(result.averageRating).toBe(0);
  });
});
