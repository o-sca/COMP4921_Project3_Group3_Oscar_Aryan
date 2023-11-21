import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserSession } from '../common';

@Catch(HttpException)
export class ProfilePicExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const session = request.session as UserSession;

    response.status(exception.getStatus());
    return response.render('profile', {
      user: session.user,
      errors: exception.getResponse()['message'],
    });
  }
}
