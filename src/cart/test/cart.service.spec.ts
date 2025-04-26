import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '../cart.service';
import { getModelToken } from '@nestjs/mongoose';
import { Product } from 'src/shared/schema/products';
import { Cart } from 'src/shared/schema/cart';
import { NotFoundException, HttpException, HttpStatus } from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;

  const mockCartModel = {
    create: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    aggregate: jest.fn(),
  };

  const mockProductModel = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getModelToken(Cart.name),
          useValue: mockCartModel,
        },
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new cart', async () => {
      const createCartDto = { products: ['product1', 'product2'] };
      const mockProducts = [{ _id: 'product1' }, { _id: 'product2' }];
      mockProductModel.find.mockResolvedValue(mockProducts);
      mockCartModel.create.mockResolvedValue({ user: 'user1', products: mockProducts });

      const result = await service.create('user1', createCartDto.products);

      expect(result).toEqual({ message: 'New cart created!', newCart: { user: 'user1', products: mockProducts } });
      expect(mockCartModel.create).toHaveBeenCalledWith({ user: 'user1', products: expect.any(Array) });
    });

    it('should throw NotFoundException if some products are not found', async () => {
      mockProductModel.find.mockResolvedValue([]);
      try {
        await service.create('user1', ['product1']);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('findAll', () => {
    it('should return user carts', async () => {
      const mockCarts = [
        {
          _id: 'cart1',
          products: [{ productId: 'product1', count: 1 }],
          productDetails: [{ name: 'Product 1', price: 100 }],
        },
      ];
      mockCartModel.aggregate.mockResolvedValue(mockCarts);

      const result = await service.findAll('user1');

      expect(result).toEqual({ userCarts: mockCarts });
      expect(mockCartModel.aggregate).toHaveBeenCalledWith(expect.any(Array));
    });

    it('should throw HttpException if no carts found', async () => {
      mockCartModel.aggregate.mockResolvedValue([]);
      try {
        await service.findAll('user1');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('updateCartProducts', () => {
    it('should update cart products', async () => {
      const mockUpdatedCart = { products: ['product1', 'product2'] };
      mockCartModel.findByIdAndUpdate.mockResolvedValue(mockUpdatedCart);

      const result = await service.updateCartProducts('cartId', ['product1'], ['product2']);

      expect(result).toEqual({ message: 'Cart updated!', updatedCart: mockUpdatedCart });
    });

    it('should throw HttpException if cart not found', async () => {
      mockCartModel.findByIdAndUpdate.mockResolvedValue(null);
      try {
        await service.updateCartProducts('cartId', ['product1'], ['product2']);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('remove', () => {
    it('should delete cart', async () => {
      const mockResponse = { message: 'Cart deleted!' };
      mockCartModel.findByIdAndDelete.mockResolvedValue(mockResponse);

      const result = await service.remove('cartId');

      expect(result).toEqual(mockResponse);
    });

    it('should throw HttpException if cart not found', async () => {
      mockCartModel.findByIdAndDelete.mockResolvedValue(null);
      try {
        await service.remove('cartId');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });
});
