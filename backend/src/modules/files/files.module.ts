import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './file.entity';
import { FileUploadInterceptor } from './file-upload.interceptor';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { UploadLimits } from './upload-limits';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  controllers: [FilesController],
  providers: [FilesService, UploadLimits, FileUploadInterceptor],
  exports: [FilesService],
})
export class FilesModule {}
