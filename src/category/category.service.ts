import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Category, CategoryDocument } from "../shared/schema/category";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Product, ProductDocument } from "src/shared/schema/products";

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<object> {
    try {
      const { title, image } = createCategoryDto;
      const foundCategory = await this.categoryModel.findOne({ title: title });
      if (foundCategory) {
        throw new BadRequestException("Category already exists!");
      }
      const newCategory = await this.categoryModel.create({
        title,
        image,
      });
      return { message: "Category created!", newCategory };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.categoryModel.find();
    if (!categories.length) {
      throw new HttpException("No categories found!", HttpStatus.NOT_FOUND);
    }
    return categories;
  }

  async findOne(id: string): Promise<Object> {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new HttpException("Category not found!", HttpStatus.NOT_FOUND);
    }
    const categoryProducts = await this.productModel.find({type: category.title})
    return {category: category, categoryProducts: categoryProducts};
  }

  async update(
    id: string,
    updateData: UpdateCategoryDto
  ): Promise<object> {
    const updatedCategory = await this.categoryModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      }
    );
    if (!updatedCategory) {
      throw new HttpException("Category not found!", HttpStatus.NOT_FOUND);
    }
    return { message: "Category updated!", updatedCategory };
  }

  async remove(id: string): Promise<object> {
    const deletedCategory = await this.categoryModel.findByIdAndDelete(id);
    if (!deletedCategory) {
      throw new HttpException("Category not found!", HttpStatus.NOT_FOUND);
    }
    return { message: "Category deleted!" };
  }
}
