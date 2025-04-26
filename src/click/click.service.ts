import * as crypto from "crypto";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ClickService {
  constructor(private config: ConfigService) {}

  generatePaymentUrl(orderId: string, amount: number): string {
    const merchant_id = this.config.get("CLICK_MERCHANT_ID");
    const service_id = this.config.get("CLICK_SERVICE_ID");
    const secret_key = this.config.get("CLICK_SECRET_KEY");

    const transaction_param = orderId;
    const amount_param = amount.toFixed(2);

    const sign = crypto
      .createHash("md5")
      .update(merchant_id + service_id + secret_key + transaction_param + amount_param)
      .digest("hex");

    return `https://my.click.uz/pay?merchant_id=${merchant_id}&service_id=${service_id}&transaction_param=${transaction_param}&amount=${amount_param}&sign_time=${Date.now()}&sign_string=${sign}`;
  }

  verifySignature(data: any): boolean {
    const secretKey = this.config.get("CLICK_SECRET_KEY");
    const expectedSign = crypto
      .createHash("md5")
      .update(
        data.click_trans_id +
          data.service_id +
          secretKey +
          data.merchant_trans_id +
          data.amount +
          data.action +
          data.sign_time
      )
      .digest("hex");

    return expectedSign === data.sign_string;
  }
}
