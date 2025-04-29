// shipping.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Shipping } from "../shared/schema/shipping";
import { CreateShippingDto } from "./dto/create-shipping.dto";
import { UpdateShippingDto } from "./dto/update-shipping.dto";

@Injectable()
export class ShippingService {
  constructor(
    @InjectModel(Shipping.name) private shippingModel: Model<Shipping>,
  ) {}

  async create(createShippingDto: CreateShippingDto): Promise<Shipping> {
    return await this.shippingModel.create(createShippingDto);
  }

  async findAll(userId: string): Promise<Shipping[]> {
    return await this.shippingModel.find({ userId });
  }

  async findOne(id: string): Promise<Shipping> {
    const shipping = await this.shippingModel.findById(id);
    if (!shipping) throw new NotFoundException("Shipping address not found");
    return shipping;
  }

  async update(
    id: string,
    updateShippingDto: UpdateShippingDto,
  ): Promise<Shipping> {
    const updated = await this.shippingModel.findByIdAndUpdate(
      id,
      updateShippingDto,
      { new: true },
    );
    if (!updated) throw new NotFoundException("Shipping address not found");
    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const res = await this.shippingModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException("Shipping address not found");
    return { message: "Shipping address deleted successfully" };
  }
}
