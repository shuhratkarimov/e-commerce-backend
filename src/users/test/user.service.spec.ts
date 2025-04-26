import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Users } from '../../shared/schema/users';
import mongoose, { Model } from 'mongoose';
import { UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(Users.name),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            updateOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<Users>>(getModelToken(Users.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a user', async () => {
      const createUserDto = { username: "shuhrat", email: 'test@example.com', password: 'password' };
      const createUserResponse = { ...createUserDto, _id: '123' };
      jest.spyOn(userModel, 'create').mockResolvedValue(createUserResponse as any);

      const result = await service.create(createUserDto);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Successfully registered!');
    });

    it('should throw error if user already exists', async () => {
      const createUserDto = { username: "shuhrat", email: 'test@example.com', password: 'password' };
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce({ email: 'test@example.com' } as any);

      await expect(service.create(createUserDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return success when login is successful', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      const user = { email: 'test@example.com', password: 'hashedPassword', isVerified: true, _id: '123' };
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(user as any);

      interface User extends Document {
        username: string;
        password: string;
        comparePassword: (candidatePassword: string) => Promise<boolean>;
      }
      
      const userSchema = new mongoose.Schema({
        username: { type: String, required: true },
        password: { type: String, required: true },
      });
      
      userSchema.methods.comparePassword = async function (candidatePassword: string) {
        return this.password === candidatePassword;
      };
      
      const User = mongoose.model<User>('User', userSchema);
      jest.spyOn(User.prototype, 'comparePassword').mockResolvedValue(true);
      const response = { json: jest.fn() };
      await service.login(loginDto, response as any);

      expect(response.json).toHaveBeenCalledWith({ message: 'You successfully logged in!' });
    });

    it('should throw error if user is not verified', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      const user = { email: 'test@example.com', password: 'hashedPassword', isVerified: false, _id: '123' };
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(user as any);

      const response = { json: jest.fn() };
      await service.login(loginDto, response as any);

      expect(response.json).toHaveBeenCalledWith({ message: 'Your email did not verified yet!' });
    });
  });
});
