import {
  Controller,
  UseGuards,
  ParseFilePipe,
  UploadedFile,
  UseInterceptors,
  FileTypeValidator,
  Post,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { StorageService } from './storage.service';

@ApiTags('upload')
@Controller('upload')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.storageService.upload(file);
  }
}
