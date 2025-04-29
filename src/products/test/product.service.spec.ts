import { Test, TestingModule } from "@nestjs/testing";
import { ProductService } from "../products.service";
import { getModelToken } from "@nestjs/mongoose";
import { Product } from "src/shared/schema/products";
import { Category } from "src/shared/schema/category";

describe("ProductService", () => {
  let service: ProductService;
  let productModel: any;
  let categoryModel: any;

  beforeEach(async () => {
    productModel = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      findOne: jest.fn(),
      countDocuments: jest.fn(),
    };

    categoryModel = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: getModelToken(Product.name), useValue: productModel },
        { provide: getModelToken(Category.name), useValue: categoryModel },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should throw if category not found", async () => {
      categoryModel.findOne.mockResolvedValue(null);
      await expect(service.create({ type: "Test" } as any)).rejects.toThrow();
    });

    it("should create a product", async () => {
      const dto = { type: "Phone", name: "iPhone 13" };
      categoryModel.findOne.mockResolvedValue({ title: "Phone" });
      productModel.create.mockResolvedValue(dto);

      const result = await service.create(dto as any);
      expect(result).toEqual({ message: "Product created!", newProduct: dto });
    });
  });

  describe("findAll", () => {
    it("should return products list", async () => {
      const products = [{ name: "Test" }];
      productModel.find.mockResolvedValue(products);

      const result = await service.findAll();
      expect(result).toEqual(products);
    });

    it("should throw if no products found", async () => {
      productModel.find.mockResolvedValue([]);
      await expect(service.findAll()).rejects.toThrow("No products found!");
    });
  });
});
