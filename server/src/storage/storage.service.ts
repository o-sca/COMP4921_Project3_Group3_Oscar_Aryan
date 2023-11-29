import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import crypto from 'crypto';
import { Response } from 'express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StorageService {
  private readonly isProduction: boolean;

  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {
    this.isProduction =
      this.config.get<string>('NODE_ENV', 'development') === 'production';
  }

  async uploadAvatar(id: number, file: Express.Multer.File, res: Response) {
    const fileId = crypto.randomBytes(16).toString('hex');
    const buf = file.buffer.toString('base64');
    const response = await this.cloudinary.uploadFile(buf, fileId, id);
    const user = await this.prisma.user.update({
      where: { id },
      data: { profile_pic_url: response.secure_url },
    });
    delete user.password;

    const token = await this.jwt.signAsync(user);

    res.cookie(this.config.get('TOKEN_NAME', 'aryan.sid'), token, {
      httpOnly: this.isProduction ?? false,
      secure: this.isProduction ?? false,
      sameSite: this.isProduction ? 'none' : 'strict',
      maxAge: 1000 * 60 * 60, // 1 hour
    });

    return;
  }
}
