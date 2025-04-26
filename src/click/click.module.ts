import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClickPayment, ClickPaymentSchema } from 'src/shared/schema/click';
import { ClickController } from './click.controller';
import { ClickService } from './click.service';

@Module({
  imports: [MongooseModule.forFeature([{
    name: ClickPayment.name,
    schema: ClickPaymentSchema
  }])], 
  controllers: [ClickController],
  providers: [ClickService],
  exports: [], 
})
export class ClickModule {}
