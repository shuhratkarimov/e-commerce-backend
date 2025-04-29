import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { ShippingService } from "../shipping.service";
import { Shipping } from "../../shared/schema/shipping";
import { NotFoundException } from "@nestjs/common";

describe("ShippingService", () => {
  let service: ShippingService;
  let model: any;

  beforeEach(async () => {
    model = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShippingService,
        { provide: getModelToken(Shipping.name), useValue: model },
      ],
    }).compile();

    service = module.get<ShippingService>(ShippingService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create and return shipping", async () => {
      const dto = { address: "Tashkent", userId: "123" };
      model.create.mockResolvedValue(dto);

      expect(await service.create(dto as any)).toEqual(dto);
      expect(model.create).toHaveBeenCalledWith(dto);
    });
  });

  describe("findAll", () => {
    it("should return list of shipping addresses", async () => {
      const result = [{ address: "Samarkand" }];
      model.find.mockResolvedValue(result);

      expect(await service.findAll("123")).toEqual(result);
      expect(model.find).toHaveBeenCalledWith({ userId: "123" });
    });
  });

  describe("findOne", () => {
    it("should return a shipping address", async () => {
      const shipping = { address: "Bukhara" };
      model.findById.mockResolvedValue(shipping);

      expect(await service.findOne("id123")).toEqual(shipping);
    });

    it("should throw NotFoundException if not found", async () => {
      model.findById.mockResolvedValue(null);
      await expect(service.findOne("id123")).rejects.toThrow(NotFoundException);
    });
  });

  describe("update", () => {
    it("should update and return shipping", async () => {
      const updated = { address: "Updated" };
      model.findByIdAndUpdate.mockResolvedValue(updated);

      expect(await service.update("id123", updated)).toEqual(updated);
    });

    it("should throw NotFoundException if not found", async () => {
      model.findByIdAndUpdate.mockResolvedValue(null);
      await expect(service.update("id123", {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("remove", () => {
    it("should delete and return success message", async () => {
      model.findByIdAndDelete.mockResolvedValue({});

      expect(await service.remove("id123")).toEqual({
        message: "Shipping address deleted successfully",
      });
    });

    it("should throw NotFoundException if not found", async () => {
      model.findByIdAndDelete.mockResolvedValue(null);
      await expect(service.remove("id123")).rejects.toThrow(NotFoundException);
    });
  });
});
