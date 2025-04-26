import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Query,
} from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateProductDto } from "./dto/create-products.dto";
import { UpdateProductDto } from "./dto/update-products.dto";
import { ProductService } from "./products.service";

@ApiTags("Products")
@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: "Create new product" })
  @ApiResponse({ status: 201, description: "Product created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @UseGuards(AuthGuard)
  @Post("add_product")
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @ApiOperation({ summary: "Get all products" })
  @ApiResponse({ status: 200, description: "List of all products" })
  @Get("get_all_products")
  async findAll() {
    return this.productService.findAll();
  }

  @ApiOperation({ summary: "Get a product by ID" })
  @ApiResponse({ status: 200, description: "Product found" })
  @ApiResponse({ status: 404, description: "Product not found" })
  @Get("get_one_product/:id")
  async findOne(@Param("id") id: string) {
    return this.productService.findOne(id);
  }

  @ApiOperation({ summary: "Search products" })
  @ApiResponse({ status: 200, description: "List of products matching search criteria" })
  @Get('search')
  async searchProducts(@Query() query: any) {
    return this.productService.search(query);
  }

  @ApiOperation({ summary: "Update a product by ID" })
  @ApiResponse({ status: 200, description: "Product updated successfully" })
  @ApiResponse({ status: 404, description: "Product not found" })
  @UseGuards(AuthGuard)
  @Put("update_product/:id")
  async update(
    @Param("id") id: string,
    @Body() updateData: UpdateProductDto
  ) {
    return this.productService.update(id, updateData);
  }

  @ApiOperation({ summary: "Delete a product" })
  @ApiResponse({ status: 200, description: "Product deleted successfully" })
  @ApiResponse({ status: 404, description: "Product not found" })
  @UseGuards(AuthGuard)
  @Delete("delete_product/:id")
  async remove(@Param("id") id: string) {
    return this.productService.remove(id);
  }
}
