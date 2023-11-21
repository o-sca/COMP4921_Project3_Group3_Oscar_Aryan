import { Injectable } from '@nestjs/common';
import crypto from 'crypto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StorageService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async uploadAvatar(id: number, file: Express.Multer.File) {
    const fileId = crypto.randomBytes(16).toString('hex');
    const buf = file.buffer.toString('base64');
    const response = await this.cloudinary.uploadFile(buf, fileId, id);
    const user = await this.prisma.user.update({
      where: { id },
      data: { profile_pic_url: response.secure_url },
    });
    delete user.password;
    return user;
  }
}
