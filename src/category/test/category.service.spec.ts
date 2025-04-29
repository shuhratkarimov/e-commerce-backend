import { Test, TestingModule } from "@nestjs/testing";
import { CategoryService } from "../category.service";
import { getModelToken } from "@nestjs/mongoose";
import { Category } from "../../shared/schema/category";
import { Product } from "src/shared/schema/products";

describe("CategoryService", () => {
  let service: CategoryService;
  let categoryModelMock: any;
  let productModelMock: any;

  beforeEach(async () => {
    categoryModelMock = {
      findOne: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };

    productModelMock = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getModelToken(Category.name),
          useValue: categoryModelMock,
        },
        {
          provide: getModelToken(Product.name),
          useValue: productModelMock,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a new category", async () => {
      const createCategoryDto = { title: "New Category", image: "image.png" };
      const createdCategory = { title: "New Category", image: "image.png" };
      categoryModelMock.create.mockResolvedValue(createdCategory);
      categoryModelMock.findOne.mockResolvedValue(null); // Ensure the category doesn't already exist

      const result = await service.create(createCategoryDto);
      expect(result).toEqual({
        message: "Category created!",
        newCategory: createdCategory,
      });
    });

    it("should throw error if category already exists", async () => {
      const createCategoryDto = { title: "New Category", image: "image.png" };
      categoryModelMock.findOne.mockResolvedValue({ title: "New Category" }); // Simulate existing category

      await expect(service.create(createCategoryDto)).rejects.toThrowError(
        "Category already exists!",
      );
    });
  });

  // describe("findAll", () => {
  //   it("should return all categories", async () => {
  //     const categories = [{ title: "Category 1", image: "image1.png" }];
  //     categoryModelMock.find.mockResolvedValue(categories);

  //     const result = await service.findAll();
  //     expect(result).toEqual(categories);
  //   });

  //   it("should throw error if no categories found", async () => {
  //     categoryModelMock.find.mockResolvedValue([]);

  //     await expect(service.findAll()).rejects.toThrowError(
  //       "No categories found!",
  //     );
  //   });
  // });
});
