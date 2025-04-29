import { Test, TestingModule } from "@nestjs/testing";
import { ClickController } from "../click.controller";
import { ClickService } from "../click.service";
import { ConfigService } from "@nestjs/config";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { HandleCallbackDto } from "../dto/handle-callback.dto";

describe("ClickController", () => {
  let app: INestApplication;
  let clickService: ClickService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClickController],
      providers: [
        ClickService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === "CLICK_MERCHANT_ID") return "merchant123";
              if (key === "CLICK_SERVICE_ID") return "service123";
              if (key === "CLICK_SECRET_KEY") return "secret123";
            }),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    clickService = module.get<ClickService>(ClickService); // Inject the ClickService instance
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should generate a payment URL", async () => {
    const response = await request(app.getHttpServer())
      .get("/click/pay")
      .query({ orderId: "order123", amount: "100" })
      .expect(200);

    expect(response.body.url).toContain("merchant_id=merchant123");
    expect(response.body.url).toContain("amount=100.00");
  });

  it("should return 200 for valid callback", async () => {
    const body: HandleCallbackDto = {
      click_trans_id: "trans123",
      service_id: "service123",
      merchant_trans_id: "order123",
      amount: 100.0,
      action: "1",
      error: "0",
      sign_time: "1624465430",
      sign_string: "valid_signature_here",
    };

    jest.spyOn(clickService, "verifySignature").mockReturnValue(true);

    const response = await request(app.getHttpServer())
      .post("/click/callback")
      .send(body)
      .expect(200);

    expect(response.body.message).toBe("Success");
  });

  it("should return 400 for invalid signature", async () => {
    const body: HandleCallbackDto = {
      click_trans_id: "trans123",
      service_id: "service123",
      merchant_trans_id: "order123",
      amount: 100.0,
      action: "1",
      error: "0",
      sign_time: "1624465430",
      sign_string: "invalid_signature",
    };

    jest.spyOn(clickService, "verifySignature").mockReturnValue(false);

    const response = await request(app.getHttpServer())
      .post("/click/callback")
      .send(body)
      .expect(400);

    expect(response.text).toBe("Invalid signature");
  });
});
