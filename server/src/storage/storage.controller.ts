import {
  Controller,
  HttpCode,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UseFilters,
  Redirect,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard, UserSession } from '../common';
import { ProfilePicExceptionFilter } from './storage-profile-pic-upload.filter';
import { StorageService } from './storage.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Storage Controller')
@UseGuards(AuthGuard)
@Controller('storage')
export class StorageController {
  constructor(private storageService: StorageService) {}

  @HttpCode(HttpStatus.OK)
  @UseFilters(ProfilePicExceptionFilter)
  @ApiOperation({
    summary: 'Uploading Profile Picture',
    description: 'Uploading user profile picture to cloudinary',
  })
  @UseInterceptors(FileInterceptor('file'))
  @Redirect('/profile')
  @Post('avatars/upload')
  async uploadFile(
    @Session() session: UserSession,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image' })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    const user = await this.storageService.uploadAvatar(session.user.id, file);
    session.user = user;
  }
}
