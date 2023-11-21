import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Render,
  Response as Res,
  Session,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import {
  AuthGuard,
  ErrorsExceptionFilter,
  SessionExceptionFilter,
  UserSession,
} from '../common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('signin')
  @Render('signin')
  @ApiOperation({
    summary: 'Render Sign-In Page',
    description: 'Renders the sign-in page with an errors array.',
  })
  signin() {
    return { errors: [] };
  }

  @UseFilters(ErrorsExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validates an existing user.' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User has been successfully Validated.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiBody({
    type: SignInDto,
    description: 'User is loaded in Session',
  })
  @Post('signin')
  async signIn(
    @Session() session: UserSession,
    @Res() res: Response,
    @Body() dto: SignInDto,
  ) {
    await this.authService.signIn(session, dto);
    return res.redirect('/');
  }

  @Get('signup')
  @Render('signup')
  @ApiOperation({
    summary: 'Render Signup Page',
    description: 'Renders the signup page with an errors array.',
  })
  signup() {
    return { errors: [] };
  }

  @UseFilters(ErrorsExceptionFilter)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creates new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User has been successfully created.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiBody({
    type: SignUpDto,
    description: 'User is loaded in Session',
  })
  @Post('signup')
  async signUp(
    @Session() session: UserSession,
    @Res() res: Response,
    @Body() dto: SignUpDto,
  ) {
    await this.authService.signUp(session, dto);
    return res.redirect('/');
  }

  @HttpCode(HttpStatus.OK)
  @Get('signout')
  @ApiOperation({
    summary: 'Sign Out',
    description:
      'Signs out the user. By destroying Session. and redirect user to root.',
  })
  signOut(@Session() session: UserSession, @Res() res: Response) {
    return this.authService.signOut(session, res);
  }

  @UseGuards(AuthGuard)
  @UseFilters(SessionExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @Render('profile')
  @ApiOperation({
    summary: 'User Profile',
    description: 'Renders the user profile page.',
  })
  @Get('profile')
  profile(@Session() session: UserSession) {
    return { user: session.user, errors: [] };
  }
}
