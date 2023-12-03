import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export class PrismaErrorHandler {
  constructor(private isProd: boolean) {}

  handle(err: PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      throw new HttpException('record not found', 404);
    }
    throw new InternalServerErrorException(
      this.isProd ? 'something went wrong' : err.message,
    );
  }
}
