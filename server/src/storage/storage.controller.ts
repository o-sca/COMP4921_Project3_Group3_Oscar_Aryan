import {
  Controller,
  HttpCode,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard, ReqUser } from '../common';
import { StorageService } from './storage.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Storage Controller')
@UseGuards(AuthGuard)
@Controller('storage')
export class StorageController {
  constructor(private storageService: StorageService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Uploading Profile Picture',
    description: 'Uploading user profile picture to cloudinary',
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('avatars/upload')
  async uploadFile(
    @ReqUser('id') userId: number,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image' })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    return await this.storageService.uploadAvatar(userId, file);
  }
}
