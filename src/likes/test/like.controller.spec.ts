import { Test, TestingModule } from "@nestjs/testing";
import { LikesController } from "../likes.controller";
import { LikeService } from "../likes.service";
import { UnauthorizedException } from "@nestjs/common";

describe("LikesController", () => {
  let controller: LikesController;
  let likeService: any;

  beforeEach(async () => {
    likeService = {
      create: jest.fn(),
      findAllLikesByUserId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikesController],
      providers: [{ provide: LikeService, useValue: likeService }],
    }).compile();

    controller = module.get<LikesController>(LikesController);
  });

  describe("create", () => {
    it("should throw if no token", async () => {
      await expect(
        controller.create({ cookies: {} }, { product: "product123" }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it("should call service.create if token exists", async () => {
      const req = {
        cookies: {
          accesstoken: "mocktoken",
        },
      };
      const mockDecoded = { id: "user123" };
      jest.mock("src/shared/utility/token-generate", () => ({
        decodeAccessToken: () => mockDecoded,
      }));

      likeService.create.mockResolvedValue({ message: "Like created!" });

      const result = await controller.create(req, { product: "product123" });
      expect(result).toEqual({ message: "Like created!" });
    });
  });

  describe("findAll", () => {
    it("should throw if no token", async () => {
      await expect(controller.findAll({ cookies: {} })).rejects.toThrow(UnauthorizedException);
    });

    it("should return likes if token exists", async () => {
      const req = {
        cookies: {
          accesstoken: "mocktoken",
        },
      };
      const mockDecoded = { id: "user123" };
      jest.mock("src/shared/utility/token-generate", () => ({
        decodeAccessToken: () => mockDecoded,
      }));

      likeService.findAllLikesByUserId.mockResolvedValue([{ _id: "like1" }]);

      const result = await controller.findAll(req);
      expect(result).toEqual([{ _id: "like1" }]);
    });
  });
});
