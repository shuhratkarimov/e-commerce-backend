import { Test, TestingModule } from "@nestjs/testing";
import { CommentController } from "../comment.controller";
import { CommentService } from "../comment.service";
import { CreateCommentDto } from "../dto/create-comment.dto";
import { JwtPayload } from "jsonwebtoken";
import { decodeAccessToken } from "src/shared/utility/token-generate";
import * as request from "supertest";
import { INestApplication } from "@nestjs/common";

describe("CommentController", () => {
  let app: INestApplication;
  let commentService: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        CommentService,
        {
          provide: "JwtService",
          useValue: {
            decodeAccessToken: jest.fn().mockReturnValue({ id: "user123" }),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    commentService = module.get<CommentService>(CommentService);
  });

  afterAll(async () => {
    await app.close();
  });

  it("should create a comment for a product", async () => {
    const createCommentDto: CreateCommentDto = {
      userId: "userId",
      productId: "product123",
      rating: 5,
      text: "Great product!",
    };

    const response = await request(app.getHttpServer())
      .post("/comment")
      .set("Cookie", ["accesstoken=valid-token"])
      .send(createCommentDto)
      .expect(201);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Comment created successfully");
  });

  it("should get all comments for a product", async () => {
    const response = await request(app.getHttpServer())
      .get("/comment/get_product_comments/product123")
      .expect(200);

    expect(response.body).toHaveProperty("comments");
    expect(response.body.comments).toBeInstanceOf(Array);
    expect(response.body).toHaveProperty("averageRating");
  });
});
