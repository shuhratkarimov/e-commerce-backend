import { Controller, Post, UploadedFile, UseInterceptors, Req, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiConsumes } from '@nestjs/swagger'; 

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  
  @Post('single')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Upload a single file' })
  @ApiResponse({ status: 200, description: 'The file has been uploaded successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Single file upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary', // This can be used in schema, not directly in ApiBody
        },
      },
    },
  })
  uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/${file.filename}`;
    return { message: 'File uploaded!', fileUrl };
  }

  @Post('multiple')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiResponse({ status: 200, description: 'The files have been uploaded successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Multiple files upload',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrls = files.map((file) => `${baseUrl}/uploads/${file.filename}`);
    return {
      message: 'Files uploaded successfully!',
      fileUrls,
    };
  }
}