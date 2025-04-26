import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { CreateCartDto } from "./dto/create-cart.dto";
import { CartService } from "./cart.service";
import { decodeAccessToken } from "src/shared/utility/token-generate";
import { JwtPayload } from "jsonwebtoken";
import { UpdateCartProductsDto } from "./dto/update-cart.dto";

@ApiTags("Carts")
@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @ApiOperation({ summary: "Create new cart" })
  @ApiResponse({ status: 201, description: "Cart created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @Post("add_to_cart")
  create(@Request() request, @Body() createcartDto: CreateCartDto) {
        if (!request.cookies?.accesstoken) {
          throw new UnauthorizedException("Token not found!");
        }
        const decoded = decodeAccessToken(request.cookies.accesstoken) as JwtPayload        
    return this.cartService.create(decoded.id, createcartDto.products);
  }

  @ApiOperation({ summary: "Get user carts" })
  @ApiResponse({ status: 200, description: "Carts found" })
  @ApiResponse({ status: 404, description: "Carts not found" })
  @Get("get_user_carts")
  async findOne(@Request() request) {
    if (!request.cookies?.accesstoken) {
      throw new UnauthorizedException("Token not found!");
    }
    const decoded = decodeAccessToken(request.cookies.accesstoken) as JwtPayload
    return this.cartService.findAll(decoded.id);
  }

  @Put("update_cart/:id")
  @ApiOperation({ summary: "Update products in the cart" })
  @ApiBody({ type: UpdateCartProductsDto })
  @ApiResponse({ status: 200, description: "Cart updated successfully" })
  @ApiResponse({ status: 404, description: "Cart not found" })
  async updateCartProducts(
    @Param("id") cartId: string,
    @Body() updateCartDto: UpdateCartProductsDto
  ) {
    return this.cartService.updateCartProducts(cartId, updateCartDto.addProducts, updateCartDto.removeProducts);
  }

  @ApiOperation({ summary: "Delete a cart" })
  @ApiResponse({ status: 200, description: "Cart deleted successfully" })
  @ApiResponse({ status: 404, description: "Cart not found" })
  @Delete("delete_cart/:id")
  async remove(@Param("id") id: string) {
    return this.cartService.remove(id);
  }
}