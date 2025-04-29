import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { AuthGuard } from "../auth/auth.guard";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@ApiTags("Categories")
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: "Create new category" })
  @ApiResponse({ status: 201, description: "Category created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @UseGuards(AuthGuard)
  @Post("add_category")
  @ApiBody({ type: CreateCategoryDto })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @ApiOperation({ summary: "Get all categories" })
  @ApiResponse({ status: 200, description: "List of all categories" })
  @Get("get_all_categories")
  async findAll() {
    return this.categoryService.findAll();
  }

  @ApiOperation({ summary: "Get a category by ID" })
  @ApiResponse({ status: 200, description: "Category found" })
  @ApiResponse({ status: 404, description: "Category not found" })
  @Get("get_one_category/:id")
  async findOne(@Param("id") id: string) {
    return this.categoryService.findOne(id);
  }

  @ApiOperation({ summary: "Update a category by ID" })
  @ApiResponse({ status: 200, description: "Category updated successfully" })
  @ApiResponse({ status: 404, description: "Category not found" })
  @UseGuards(AuthGuard)
  @Put("update_category/:id")
  @ApiBody({ type: UpdateCategoryDto })
  async update(@Param("id") id: string, @Body() updateData: UpdateCategoryDto) {
    return this.categoryService.update(id, updateData);
  }

  @ApiOperation({ summary: "Delete a category" })
  @ApiResponse({ status: 200, description: "Category deleted successfully" })
  @ApiResponse({ status: 404, description: "Category not found" })
  @UseGuards(AuthGuard)
  @Delete("delete_category/:id")
  async remove(@Param("id") id: string) {
    return this.categoryService.remove(id);
  }
}
