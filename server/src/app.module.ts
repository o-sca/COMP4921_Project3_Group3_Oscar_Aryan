import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { cwd } from 'process';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AuthGuard, NotFoundExceptionFilter } from './common';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { StorageModule } from './storage/storage.module';
import { FriendModule } from './friend/friend.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(cwd(), '.env'),
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    StorageModule,
    CloudinaryModule,
    FriendModule,
    EventModule,
  ],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: NotFoundExceptionFilter,
    },
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
