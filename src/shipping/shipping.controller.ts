import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import { Request } from 'express';
import { decodeAccessToken } from 'src/shared/utility/token-generate'; 
import { JwtPayload } from 'jsonwebtoken';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Shipping')
@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shipping address' })
  @ApiResponse({ status: 201, description: 'The shipping address has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createShippingDto: CreateShippingDto, @Req() req: Request) {
    const decoded = decodeAccessToken(req.cookies.accesstoken) as JwtPayload;
    return this.shippingService.create({ ...createShippingDto, userId: decoded.id });
  }

  @Get()
  @ApiOperation({ summary: 'Get all shipping addresses' })
  @ApiResponse({ status: 200, description: 'List of shipping addresses.' })
  async findAll(@Req() req: Request) {
    const decoded = decodeAccessToken(req.cookies.accesstoken) as JwtPayload;
    return this.shippingService.findAll(decoded.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific shipping address by ID' })
  @ApiResponse({ status: 200, description: 'Shipping address retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Shipping address not found.' })
  findOne(@Param('id') id: string) {
    return this.shippingService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a shipping address by ID' })
  @ApiResponse({ status: 200, description: 'Shipping address updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  update(@Param('id') id: string, @Body() updateShippingDto: UpdateShippingDto) {
    return this.shippingService.update(id, updateShippingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a shipping address by ID' })
  @ApiResponse({ status: 200, description: 'Shipping address deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Shipping address not found.' })
  remove(@Param('id') id: string) {
    return this.shippingService.remove(id);
  }
}