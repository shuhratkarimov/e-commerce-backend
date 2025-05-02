// src/upload/upload.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import { UploadService } from './upload.service';


@Controller('upload')
export class UploadController {
  constructor(private readonly supabase: UploadService) {}
  private generateUniqueFileName(originalName: string): string {
    const ext = extname(originalName);
    return `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  }

  @Post('single')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadSingleFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!file) throw new BadRequestException('Fayl topilmadi');

    const fileName = this.generateUniqueFileName(file.originalname);

    const { error } = await this.supabase.client.storage
      .from('images')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      throw new BadRequestException('Yuklashda xatolik: ' + error.message);
    }

    const { data: publicUrl } = this.supabase.client.storage
      .from('images')
      .getPublicUrl(fileName);

    return {
      success: true,
      message: 'Fayl yuklandi',
      data: {
        originalName: file.originalname,
        fileName,
        url: publicUrl,
      },
    };
  }

  @Post('multiple')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Fayllar topilmadi');
    }

    const uploaded = [];

    for (const file of files) {
      const fileName = this.generateUniqueFileName(file.originalname);

      const { error } = await this.supabase.client.storage
        .from('images')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) {
        throw new BadRequestException(
          `Fayl yuklashda xatolik (${file.originalname}): ${error.message}`,
        );
      }

      const { data: publicUrl } = this.supabase.client.storage
        .from('images')
        .getPublicUrl(fileName);

      uploaded.push({
        originalName: file.originalname,
        fileName,
        url: publicUrl,
      });
    }

    return {
      success: true,
      message: `${uploaded.length} ta fayl yuklandi`,
      data: uploaded,
    };
  }
}
