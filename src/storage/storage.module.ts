import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  providers: [StorageService, CloudinaryService],
  controllers: [StorageController],
})
export class StorageModule {}
