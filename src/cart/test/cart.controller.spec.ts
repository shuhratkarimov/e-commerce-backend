import { Test, TestingModule } from "@nestjs/testing";
import { CartController } from "../cart.controller";
import { CartService } from "../cart.service";
import { UnauthorizedException } from "@nestjs/common";

describe("CartController", () => {
  let controller: CartController;
  let service: CartService;

  const mockCartService = {
    create: jest.fn(),
    findAll: jest.fn(),
    updateCartProducts: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: mockCartService,
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    service = module.get<CartService>(CartService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  // describe("create", () => {
  //   it("should create a new cart", async () => {
  //     const createCartDto = { products: ["product1", "product2"] };
  //     const mockResponse = { message: "New cart created!", newCart: {} };

  //     jest.spyOn(service, "create").mockResolvedValue(mockResponse);

  //     const result = await controller.create(
  //       { cookies: { accesstoken: "mockToken" } },
  //       createCartDto,
  //     );

  //     expect(result).toEqual(mockResponse);
  //     expect(service.create).toHaveBeenCalledWith(
  //       "decodedUserId",
  //       createCartDto.products,
  //     );
  //   });

  //   it("should throw UnauthorizedException if token not found", async () => {
  //     try {
  //       await controller.create({ cookies: {} }, { products: [] });
  //     } catch (e) {
  //       expect(e).toBeInstanceOf(UnauthorizedException);
  //     }
  //   });
  // });

  // describe("findAll", () => {
  //   it("should return all carts for the user", async () => {
  //     const mockResponse = { userCarts: [] };
  //     jest.spyOn(service, "findAll").mockResolvedValue(mockResponse);

  //     const result = await controller.findOne({
  //       cookies: { accesstoken: "mockToken" },
  //     });

  //     expect(result).toEqual(mockResponse);
  //     expect(service.findAll).toHaveBeenCalledWith("decodedUserId");
  //   });

  //   it("should throw UnauthorizedException if token not found", async () => {
  //     try {
  //       await controller.findOne({ cookies: {} });
  //     } catch (e) {
  //       expect(e).toBeInstanceOf(UnauthorizedException);
  //     }
  //   });
  // });

  describe("updateCartProducts", () => {
    it("should update cart products", async () => {
      const updateCartDto = {
        addProducts: ["product1"],
        removeProducts: ["product2"],
      };
      const mockResponse = { message: "Cart updated!", updatedCart: {} };

      jest.spyOn(service, "updateCartProducts").mockResolvedValue(mockResponse);

      const result = await controller.updateCartProducts(
        "cartId",
        updateCartDto,
      );

      expect(result).toEqual(mockResponse);
      expect(service.updateCartProducts).toHaveBeenCalledWith(
        "cartId",
        updateCartDto.addProducts,
        updateCartDto.removeProducts,
      );
    });
  });

  describe("remove", () => {
    it("should delete the cart", async () => {
      const mockResponse = { message: "Cart deleted!" };
      jest.spyOn(service, "remove").mockResolvedValue(mockResponse);

      const result = await controller.remove("cartId");

      expect(result).toEqual(mockResponse);
      expect(service.remove).toHaveBeenCalledWith("cartId");
    });
  });
});
