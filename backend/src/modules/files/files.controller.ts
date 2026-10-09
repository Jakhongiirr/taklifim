import {
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiPayloadTooLargeResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { JwtPayload } from '../auth/auth.types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { FileDto } from './dto/file.dto';
import { FileUploadInterceptor } from './file-upload.interceptor';
import {
  ALLOWED_FILE_TYPES,
  ALLOWED_FILE_TYPES_PATTERN,
  AUDIO_FILE_TYPES,
  IMAGE_FILE_TYPES,
} from './file-types';
import { FilesService } from './files.service';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(FileUploadInterceptor)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiOperation({
    summary: 'Upload a public file',
    description: `Images (any user): ${Object.keys(IMAGE_FILE_TYPES).join(', ')}. Audio (admin only): ${Object.keys(AUDIO_FILE_TYPES).join(', ')}. Max size: images UPLOAD_IMAGE_MAX_SIZE_MB (default 10 MB), audio UPLOAD_AUDIO_MAX_SIZE_MB (default 50 MB).`,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiBadRequestResponse({ description: 'Missing file or type not allowed' })
  @ApiPayloadTooLargeResponse({ description: 'File too large' })
  @ApiForbiddenResponse({ description: 'Audio upload by a non-admin' })
  upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // Checks the file's magic bytes, then replaces the client-sent mimetype.
          new FileTypeValidator({
            fileType: ALLOWED_FILE_TYPES_PATTERN,
            overrideMimeType: true,
            errorMessage: `File type not allowed. Allowed: ${Object.keys(ALLOWED_FILE_TYPES).join(', ')}`,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @CurrentUser() user: JwtPayload,
  ): Promise<FileDto> {
    return this.filesService.upload(file, user);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiOperation({ summary: 'File details (uploader or admin)' })
  @ApiNotFoundResponse({ description: 'No such file, or not yours' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<FileDto> {
    return this.filesService.findOne(id, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiOperation({ summary: 'Delete a file (uploader or admin)' })
  @ApiForbiddenResponse({ description: 'Not the uploader or an admin' })
  @ApiNotFoundResponse()
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<void> {
    return this.filesService.remove(id, user);
  }
}
