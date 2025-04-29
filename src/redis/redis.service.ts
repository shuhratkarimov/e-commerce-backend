import { Injectable } from "@nestjs/common";
import { createClient } from "redis";

@Injectable()
export class RedisService {
  private client;
  constructor() {
    this.client = createClient({
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASS,
      socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_SOCKET_PORT as string),
      },
    });
    this.client.on("error", (err: any) => {
      console.log("Redis error: " + err);
    });
    this.client.connect();
    console.log("Redis connected");
  }
  async set(key: string, value: string, ttl: number) {
    await this.client.set(key, value);
    if (ttl) {
      await this.client.expire(key, ttl);
    }
  }
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }
}
