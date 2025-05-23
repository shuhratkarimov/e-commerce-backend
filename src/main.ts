import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cors from "cors";
import cookieParser from "cookie-parser";
import { AllExceptionFilter } from "./filter/all-exception.filter";
import { join } from "path";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { CustomLogger } from "./log/logger";
import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";
import express from "express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const PORT = process.env.PORT || 3000;

  // Umumiy CORS sozlamalari (API so‘rovlar uchun)
  app.use(
    cors({
      origin: [
        "https://shuhratkarimov.uz", // Faqat bu domenlardan so‘rovlarga ruxsat
        "http://localhost:3000",
      ],
      credentials: true, // Cookie va boshqa ma'lumotlarni yuborishga ruxsat
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "token"], // kerakli header’lar
    })
  );

  // uploads papkasi uchun alohida CORS sozlamalari
  app.use(
    "/uploads",
    cors({
      origin: [
        "https://shuhratkarimov.uz", // Faqat bu domenlardan so‘rovlarga ruxsat
        "http://localhost:3000",
      ],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "token"],
    }),
    express.static(join(process.cwd(), "uploads")) // uploads papkasidagi fayllarni ko'rsatish
  );

  app.use(cookieParser());

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", "https://cpanel.shuhratkarimov.uz", "https://shuhratkarimov.uz"], // rasm URL’lariga ruxsat
        },
      },
    })
  );

  app.useGlobalFilters(new AllExceptionFilter());

  app.useLogger(app.get(CustomLogger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // faqat kerakli ma'lumotlar
      forbidNonWhitelisted: true,
      transform: true, // avtomatik tip konversiyasi
    })
  );

  // Swagger konfiguratsiyasi
  const config = new DocumentBuilder()
    .setTitle("E-commerce website API")
    .setDescription("E-commerce website of electronical products")
    .setVersion("1.0")
    .addTag("E-commerce")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  try {
    await app.listen(PORT, () => {
      console.log(`Server is running on the port: ${PORT}`);
      console.log("CI/CD ishladi!");
    });
  } catch (error) {
    console.error(`Server failed to start: ${error.message}`);
    process.exit(1);
  }
}
bootstrap();
