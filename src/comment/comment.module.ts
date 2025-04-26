import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from 'src/shared/schema/comment';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [MongooseModule.forFeature([{
    name: Comment.name,
    schema: CommentSchema
  }
])], 
  controllers: [CommentController],
  providers: [CommentService],
  exports: [], 
})
export class CommentModule {}
