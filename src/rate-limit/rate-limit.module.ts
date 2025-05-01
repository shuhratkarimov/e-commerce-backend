import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { CustomThrottlerGuard } from '../guards/rate-limiter.guard';
import { RateLimitLogSchema, RATE_LIMIT_LOG_MODEL } from '../shared/schema/rate-limiter';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RATE_LIMIT_LOG_MODEL, schema: RateLimitLogSchema }]),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000, // 10 soniya
        limit: 10,   // 3 ta so‘rov
        ignoreUserAgents: [
          /bot/i,             // umumiy bot
          /crawler/i,         // crawler
          /spider/i,          // spider
          /curl/i,            // curl orqali test qiluvchilar
          /PostmanRuntime/i,  // Postman
          /axios/i,           // axios HTTP client
          /Googlebot/i,       // Googlebot
          /Bingbot/i,         // Bingbot
          /Slackbot-LinkExpanding/i, // Slack preview'lari
          /WhatsApp/i         // WhatsApp preview'lari
        ],
      },
    ]),
  ],
  providers: [CustomThrottlerGuard],
  exports: [CustomThrottlerGuard],
})
export class RateLimitModule {}