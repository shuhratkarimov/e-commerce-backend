import { Controller, Get, Query, Post, Body, Res } from "@nestjs/common";
import { ClickService } from "./click.service";
import { Response } from "express";
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from "@nestjs/swagger";
import { HandleCallbackDto } from "./dto/handle-callback.dto";

@ApiTags("Click Payment")
@Controller("click")
export class ClickController {
  constructor(private readonly clickService: ClickService) {}

  @ApiOperation({ summary: "Generate payment URL for the order" })
  @ApiResponse({
    status: 200,
    description: "The payment URL for the given order",
    schema: { example: { url: "https://paymentlink.com" } },
  })
  @Get("pay")
  createPaymentLink(
    @Query("orderId") orderId: string,
    @Query("amount") amount: string
  ) {
    const url = this.clickService.generatePaymentUrl(orderId, +amount);
    return { url };
  }

  @ApiOperation({ summary: "Handle payment callback from Click" })
  @ApiResponse({
    status: 200,
    description: "Payment successful and verified",
    schema: { example: { message: "Success" } },
  })
  @ApiResponse({ status: 400, description: "Invalid signature" })
  @ApiBody({ type: HandleCallbackDto })
  @Post("callback")
  async handleCallback(@Body() body: HandleCallbackDto, @Res() res: Response) {
    const isValid = this.clickService.verifySignature(body);

    if (!isValid) return res.status(400).send("Invalid signature");

    if (body.action === "1" && body.error === "0") {
      console.log("Payment confirmed for order:", body.merchant_trans_id);
    }

    return res.status(200).send({ message: "Success" });
  }
}
