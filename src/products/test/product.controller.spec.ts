import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../products.controller';
import { ProductService } from '../products.service';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProductService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    search: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{ provide: ProductService, useValue: mockProductService }],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create', async () => {
      const dto = { name: 'Test Product', type: 'Phone' };
      const result = { message: 'Product created!' };
      mockProductService.create.mockResolvedValue(result);

      expect(await controller.create(dto as any)).toEqual(result);
      expect(mockProductService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = [{ name: 'Test' }];
      mockProductService.findAll.mockResolvedValue(products);
      expect(await controller.findAll()).toEqual(products);
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const product = { name: 'Test' };
      mockProductService.findOne.mockResolvedValue(product);
      expect(await controller.findOne('123')).toEqual(product);
    });
  });

  describe('search', () => {
    it('should return filtered products', async () => {
      const query = { brand: 'Samsung' };
      const response = { count: 1, products: ['Product'] };
      mockProductService.search.mockResolvedValue(response);

      expect(await controller.searchProducts(query)).toEqual(response);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const result = { message: 'Product updated!' };
      mockProductService.update.mockResolvedValue(result);

      expect(await controller.update('123', { name: 'Updated' } as any)).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      const result = { message: 'Product deleted!' };
      mockProductService.remove.mockResolvedValue(result);

      expect(await controller.remove('123')).toEqual(result);
    });
  });
});
