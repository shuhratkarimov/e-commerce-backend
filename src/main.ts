import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import { AllExceptionFilter } from "./filter/all-exception.filter";
import { join } from "path";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { CustomLogger } from "./log/logger";
import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const PORT = process.env.PORT || 3000;

  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    }),
  );
  app.use(cookieParser());

  app.useGlobalFilters(new AllExceptionFilter());

  app.useLogger(app.get(CustomLogger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("E-commerce website API")
    .setDescription("E-commerce website of electronical products")
    .setVersion("1.0")
    .addTag("E-commerce")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  app.useStaticAssets(join(process.cwd(), "uploads"), {
    prefix: "/uploads/",
    index: false,
  });

  try {
    await app.listen(PORT, () => {
      console.log(`Server is running on the port: ${PORT}`);
    });
  } catch (error) {
    console.error(`Server failed to start: ${error.message}`);
    process.exit(1);
  }
}
bootstrap();
