// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { UseGuards } from '@nestjs/common';
import { CustomThrottlerGuard } from './guards/rate-limiter.guard';

@Controller()
@UseGuards(CustomThrottlerGuard)
export class AppController {
  @Get('limited')
  @Throttle({ default: { limit: 5, ttl: 30000 } }) // 5 requests per 30 seconds
  getLimited() {
    return { message: 'This endpoint is rate-limited' };
  }

  @Get('unlimited')
  @SkipThrottle()
  getUnlimited() {
    return { message: 'This endpoint is not rate-limited' };
  }
}