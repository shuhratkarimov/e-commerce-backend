import { Test, TestingModule } from '@nestjs/testing';
import { ShippingController } from '../shipping.controller';
import { ShippingService } from '../shipping.service';
import { Request } from 'express';
import { decodeAccessToken } from 'src/shared/utility/token-generate';

jest.mock('src/shared/utility/token-generate', () => ({
  decodeAccessToken: jest.fn(),
}));

describe('ShippingController', () => {
  let controller: ShippingController;
  let service: ShippingService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };


  const mockReq = {
    cookies: { accesstoken: 'fake.token' },
  } as Partial<Request>;

  beforeEach(async () => {
    (decodeAccessToken as jest.Mock).mockReturnValue({ id: 'user123' });

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShippingController],
      providers: [{ provide: ShippingService, useValue: mockService }],
    }).compile();

    controller = module.get<ShippingController>(ShippingController);
    service = module.get<ShippingService>(ShippingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with userId', async () => {
      const dto = { address: 'Qarshi' };
      const result = { address: 'Qarshi', userId: 'user123' };
      mockService.create.mockResolvedValue(result);

      expect(await controller.create(dto as any, mockReq as any)).toEqual(result);
      expect(mockService.create).toHaveBeenCalledWith({ ...dto, userId: 'user123' });
    });
  });

  describe('findAll', () => {
    it('should return user shippings', async () => {
      const result = [{ address: 'Fergana' }];
      mockService.findAll.mockResolvedValue(result);

      expect(await controller.findAll(mockReq as any)).toEqual(result);
      expect(mockService.findAll).toHaveBeenCalledWith('user123');
    });
  });

  describe('findOne', () => {
    it('should return one shipping', async () => {
      const shipping = { address: 'Nukus' };
      mockService.findOne.mockResolvedValue(shipping);

      expect(await controller.findOne('id1')).toEqual(shipping);
    });
  });

  describe('update', () => {
    it('should update shipping', async () => {
      const updated = { address: 'Updated' };
      mockService.update.mockResolvedValue(updated);

      expect(await controller.update('id1', updated as any)).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should delete shipping', async () => {
      const result = { message: 'Shipping address deleted successfully' };
      mockService.remove.mockResolvedValue(result);

      expect(await controller.remove('id1')).toEqual(result);
    });
  });
});
