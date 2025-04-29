import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "../users.controller";
import { UsersService } from "../users.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { LoginDto } from "../dto/login-dto";
import { UnauthorizedException } from "@nestjs/common";

describe("UsersController", () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            login: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should successfully create a user", async () => {
      const createUserDto: CreateUserDto = {
        username: "shuhrat",
        email: "test@example.com",
        password: "password",
      };
      jest.spyOn(service, "create").mockResolvedValue({
        success: true,
        message: "Successfully registered!",
        result: "Verification code sent to your email",
      });

      const result = await controller.create(createUserDto);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Successfully registered!");
    });
  });

  // describe("login", () => {
  //   it("should successfully log in", async () => {
  //     const loginDto: LoginDto = {
  //       email: "test@example.com",
  //       password: "password",
  //     };
  //     jest.spyOn(service, "login").mockResolvedValue({
  //       message: "You successfully logged in!",
  //     });

  //     const response = { json: jest.fn() };
  //     await controller.login(loginDto, response as any);

  //     expect(response.json).toHaveBeenCalledWith({
  //       message: "You successfully logged in!",
  //     });
  //   });

  //   it("should throw UnauthorizedException if login fails", async () => {
  //     const loginDto: LoginDto = {
  //       email: "test@example.com",
  //       password: "wrongpassword",
  //     };
  //     jest
  //       .spyOn(service, "login")
  //       .mockRejectedValue(new UnauthorizedException("Invalid password"));

  //     const response = { json: jest.fn() };
  //     await controller.login(loginDto, response as any);

  //     expect(response.json).toHaveBeenCalledWith({
  //       message: "Invalid password",
  //     });
  //   });
  // });
});
