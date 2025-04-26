import { Test, TestingModule } from '@nestjs/testing';
import { ClickService } from '../click.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

describe('ClickService', () => {
  let service: ClickService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClickService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'CLICK_MERCHANT_ID') return 'merchant123';
              if (key === 'CLICK_SERVICE_ID') return 'service123';
              if (key === 'CLICK_SECRET_KEY') return 'secret123';
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ClickService>(ClickService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generatePaymentUrl', () => {
    it('should generate a valid payment URL', () => {
      const orderId = 'order123';
      const amount = 100;
      const paymentUrl = service.generatePaymentUrl(orderId, amount);

      expect(paymentUrl).toContain('merchant_id=merchant123');
      expect(paymentUrl).toContain('service_id=service123');
      expect(paymentUrl).toContain('transaction_param=order123');
      expect(paymentUrl).toContain('amount=100.00');
      expect(paymentUrl).toContain('sign_string=');
    });
  });

  describe('verifySignature', () => {
    it('should return true for valid signature', () => {
      const data = {
        click_trans_id: 'trans123',
        service_id: 'service123',
        merchant_trans_id: 'order123',
        amount: '100.00',
        action: '1',
        sign_time: '1624465430',
        sign_string: 'valid_signature_here',
      };

      // Mock the signature calculation to return the expected value
      jest.spyOn(crypto, 'createHash').mockImplementationOnce(() => {
        return {
          update: jest.fn().mockReturnThis(),
          digest: jest.fn().mockReturnValue('valid_signature_here'),
        } as any;
      });

      const isValid = service.verifySignature(data);
      expect(isValid).toBe(true);
    });

    it('should return false for invalid signature', () => {
      const data = {
        click_trans_id: 'trans123',
        service_id: 'service123',
        merchant_trans_id: 'order123',
        amount: '100.00',
        action: '1',
        sign_time: '1624465430',
        sign_string: 'invalid_signature',
      };

      const isValid = service.verifySignature(data);
      expect(isValid).toBe(false);
    });
  });
});
