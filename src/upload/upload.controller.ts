import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  UploadedFiles,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { Request } from "express";
import { existsSync, mkdirSync } from "fs";

@Controller("upload")
export class UploadController {
  private readonly uploadDir = join(process.cwd(), "uploads");

  constructor() {
    this.createUploadFolder();
  }

  private createUploadFolder() {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  // Statik konfiguratsiya obyektini tashqariga chiqaramiz
  private static getStorageOptions(uploadDir: string) {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueName}${ext}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = /\.(jpg|jpeg|png|gif|pdf)$/i;
        if (!file.originalname.match(allowedTypes)) {
          return cb(
            new BadRequestException("Faqat rasm va PDF fayllar ruxsat etilgan"),
            false,
          );
        }
        cb(null, true);
      },
    };
  }

  @Post("single")
  @UseInterceptors(
    FileInterceptor(
      "file",
      UploadController.getStorageOptions(join(process.cwd(), "uploads")),
    ),
  )
  uploadSingleFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new BadRequestException("Fayl yuklanmadi");
    }

    const fileUrl = `https://${req.get("host")}/uploads/${file.filename}`;
    return {
      success: true,
      message: "Fayl muvaffaqiyatli yuklandi",
      data: {
        originalName: file.originalname,
        fileName: file.filename,
        size: file.size,
        mimeType: file.mimetype,
        url: fileUrl,
      },
    };
  }

  @Post("multiple")
  @UseInterceptors(
    FilesInterceptor(
      "files",
      10,
      UploadController.getStorageOptions(join(process.cwd(), "uploads")),
    ),
  )
  uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException("Hech qanday fayl yuklanmadi");
    }

    const baseUrl = `https://${req.get("host")}`;
    const uploadedFiles = files.map((file) => ({
      originalName: file.originalname,
      fileName: file.filename,
      size: file.size,
      mimeType: file.mimetype,
      url: `${baseUrl}/uploads/${file.filename}`,
    }));

    return {
      success: true,
      message: `${files.length} ta fayl muvaffaqiyatli yuklandi`,
      data: uploadedFiles,
    };
  }
}
