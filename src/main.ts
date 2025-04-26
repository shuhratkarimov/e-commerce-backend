import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as cors from "cors";
import * as express from "express"
import { AllExceptionFilter } from './filter/all-exception.filter';
import { join } from "path";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { CustomLogger } from './log/logger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 4001
  app.use(cors());
  app.use(cookieParser());
  // app.useGlobalFilters(new AllExceptionFilter());
  app.useLogger(app.get(CustomLogger));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const config = new DocumentBuilder()
    .setTitle("E-commerce website API")
    .setDescription(
      "E-commerce website of electronical products"
    )
    .setVersion("1.0")
    .addTag("E-commerce")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, documentFactory);
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  await app.listen(PORT, () => {
    console.log("Server is running on the port: " + PORT);
  })
}
bootstrap();
