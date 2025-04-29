import { Test, TestingModule } from "@nestjs/testing";
import { CommentController } from "../comment.controller";
import { CommentService } from "../comment.service";
import { CreateCommentDto } from "../dto/create-comment.dto";
import { JwtPayload } from "jsonwebtoken";
import { decodeAccessToken } from "src/shared/utility/token-generate";
import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";

describe("CommentController", () => {
  let app: INestApplication;
  let commentService: CommentService;

  const mockCommentModel = {
    find: jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue([
        {
          _id: "comment1",
          rating: 4,
          productId: "680a1498d4d8ce6fde1fd101",
          userId: { _id: "user1", name: "Alice" },
          text: "Zo`r mahsulot!",
        },
      ]),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        CommentService,
        {
          provide: getModelToken("Comment"),
          useValue: mockCommentModel,
        },
        {
          provide: "CommentModel",
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            deleteOne: jest.fn(),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    commentService = module.get<CommentService>(CommentService);
  });

  // it("should create a comment for a product", async () => {
  //   const createCommentDto: CreateCommentDto = {
  //     userId: "userId",
  //     productId: "product123",
  //     rating: 5,
  //     text: "Great product!",
  //   };

  //   const response = await request(app.getHttpServer())
  //     .post("/comment")
  //     .set("Cookie", ["accesstoken=valid-token"])
  //     .send(createCommentDto)
  //     .expect(201);

  //   expect(response.body).toHaveProperty("message");
  //   expect(response.body.message).toBe("Comment created successfully");
  // });

  // it("should get all comments for a product", async () => {
  //   const response = await request(app.getHttpServer())
  //     .get("/comment/get_product_comments/680a1498d4d8ce6fde1fd101")
  //     .expect(200);

  //   expect(response.body).toHaveProperty("comments");
  //   expect(response.body.comments).toBeInstanceOf(Array);
  //   expect(response.body).toHaveProperty("averageRating");
  //   expect(response.body.averageRating).toBe(4);
  // });

  it("should return empty array and averageRating 0 if no comments", async () => {
    const mockFind = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue([]),
    });

    commentService["commentModel"].find = mockFind;

    const response = await request(app.getHttpServer())
      .get("/comment/get_product_comments/680a1498d4d8ce6fde1fd101")
      .expect(200);

    expect(response.body).toEqual({
      message: "No comments for this product yet.",
      averageRating: 0,
      comments: [],
    });
  });
});
