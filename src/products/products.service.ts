import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product, ProductDocument } from "src/shared/schema/products";
import { CreateProductDto } from "./dto/create-products.dto";
import { UpdateProductDto } from "./dto/update-products.dto";
import { Category, CategoryDocument } from "src/shared/schema/category";

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>
  ) {}

  async create(createProductDto: CreateProductDto): Promise<object> {
    try {
      const foundCategory = await this.categoryModel.findOne({
        title: createProductDto.type,
      });
      if (!foundCategory) {
        throw new HttpException(
          `Category ${createProductDto.type} not found! \nPlease, create this category before adding this product!`,
          HttpStatus.BAD_REQUEST
        );
      }
      const newProduct = await this.productModel.create(createProductDto);
      return { message: "Product created!", newProduct };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async search(query: any): Promise<Object> {
    const plainQuery = { ...query };
    const filters: any = {};

    if (plainQuery.brand) {
      filters.brand = { $regex: plainQuery.brand, $options: 'i' };
    }   

    if (plainQuery.name) {
      filters.name = { $regex: plainQuery.name, $options: 'i' };
    }

    if (plainQuery.minPrice || plainQuery.maxPrice) {
      filters.price = {};
      if (plainQuery.minPrice) filters.price.$gte = Number(plainQuery.minPrice);
      if (plainQuery.maxPrice) filters.price.$lte = Number(plainQuery.maxPrice);
    }

    if (plainQuery.minBattery || plainQuery.maxBattery) {
      filters.batteryCapacity = {};
      if (plainQuery.minBattery) filters.batteryCapacity.$gte = Number(plainQuery.minBattery);
      if (plainQuery.maxBattery) filters.batteryCapacity.$lte = Number(plainQuery.maxBattery);
    }

    if (plainQuery.screenType) {
      filters.screenType = { $regex: plainQuery.screenType, $options: 'i' };
    }

    if (plainQuery.minScreen || plainQuery.maxScreen) {
      filters.screenSize = {};
      if (plainQuery.minScreen) filters.screenSize.$gte = Number(plainQuery.minScreen);
      if (plainQuery.maxScreen) filters.screenSize.$lte = Number(plainQuery.maxScreen);
    }

    if (plainQuery.protectionClass) {
      filters.protectionClass = Number(plainQuery.protectionClass);
    }

    if (plainQuery.minRom || plainQuery.maxRom) {
      filters.rom = {};
      if (plainQuery.minRom) filters.rom.$gte = Number(plainQuery.minRom);
      if (plainQuery.maxRom) filters.rom.$lte = Number(plainQuery.maxRom);
    }   
    const [products, count] = await Promise.all([
      this.productModel.find(filters).exec(),
      this.productModel.countDocuments(filters).exec()
    ]);
    return { count, products };
  }

  async findAll(): Promise<Product[]> {
    const products = await this.productModel.find();
    if (!products.length) {
      throw new HttpException("No products found!", HttpStatus.NOT_FOUND);
    }
    return products;
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new HttpException("Product not found!", HttpStatus.NOT_FOUND);
    }
    return product;
  }

  async update(id: string, updateData: UpdateProductDto): Promise<object> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      }
    );
    if (!updatedProduct) {
      throw new HttpException("Product not found!", HttpStatus.NOT_FOUND);
    }
    return { message: "Product updated!", updatedProduct };
  }

  async remove(id: string): Promise<object> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id);
    if (!deletedProduct) {
      throw new HttpException("Product not found!", HttpStatus.NOT_FOUND);
    }
    return { message: "Product deleted!" };
  }
}
