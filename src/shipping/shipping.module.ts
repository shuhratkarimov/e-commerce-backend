import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Shipping, ShippingSchema } from 'src/shared/schema/shipping';
import { ShippingController } from './shipping.controller';
import { ShippingService } from './shipping.service';

@Module({
  imports: [MongooseModule.forFeature([{
    name: Shipping.name,
    schema: ShippingSchema
  }])], 
  controllers: [ShippingController],
  providers: [ShippingService],
  exports: [], 
})
export class ShippingModule {}
