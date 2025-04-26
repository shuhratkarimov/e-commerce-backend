import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CategoryController } from '../category.controller';
import { CategoryService } from '../category.service';
import { AuthGuard } from '../../auth/auth.guard';
import { INestApplication } from '@nestjs/common';

describe('CategoryController', () => {
  let app: INestApplication;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    categoryService = module.get<CategoryService>(CategoryService);
    await app.init();
  });

  it('should create a category', async () => {
    const createCategoryDto = { title: 'New Category', image: 'image.png' };
    const result = { message: 'Category created!', newCategory: createCategoryDto };
    categoryService.create = jest.fn().mockResolvedValue(result);

    return request(app.getHttpServer())
      .post('/category/add_category')
      .send(createCategoryDto)
      .expect(201)
      .expect(result);
  });

  it('should return a 400 error if category already exists', async () => {
    const createCategoryDto = { title: 'New Category', image: 'image.png' };
    categoryService.create = jest.fn().mockRejectedValue(new Error('Category already exists!'));

    return request(app.getHttpServer())
      .post('/category/add_category')
      .send(createCategoryDto)
      .expect(400);
  });

  afterAll(async () => {
    await app.close();
  });
});
