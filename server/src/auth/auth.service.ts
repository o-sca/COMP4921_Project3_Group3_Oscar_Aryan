import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { ValidationException } from '../common';
import { PrismaService } from '../prisma/prisma.service';
import { SignInDto, SignUpDto } from './dto';

@Injectable()
export class AuthService {
  private readonly saltRounds: number;
  private readonly isProduction: boolean;

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {
    this.saltRounds = this.config.get('SALT_ROUNDS', 12);
    this.isProduction =
      this.config.get<string>('NODE_ENV', 'development') === 'production';
  }

  async signIn(dto: SignInDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new ValidationException(
        'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isValid = bcrypt.compareSync(dto.password, user.password);
    if (!isValid) {
      throw new ValidationException(
        'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = await this.jwt.signAsync({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      profile_pic_url: user.profile_pic_url,
    });

    res.cookie(this.config.get<string>('TOKEN_NAME', 'aryan.sid'), token, {
      httpOnly: this.isProduction ?? false,
      secure: this.isProduction ?? false,
      sameSite: this.isProduction ? 'none' : 'strict',
      maxAge: 1000 * 60 * 60, // 1 hour
    });

    return;
  }

  async signUp(dto: SignUpDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new ValidationException('Passwords do not match');
    }

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: bcrypt.hashSync(dto.password, this.saltRounds),
          first_name: dto.firstName,
          last_name: dto.lastName,
          profile_pic_url: dto.profilePicture,
        },
      });

      delete user.password;
      return;
    } catch (err) {
      if (err.code === 'P2002') {
        throw new ValidationException('Credentials taken');
      }
      throw new ValidationException('Something went wrong');
    }
  }

  async signOut(token: string, res: Response) {
    if (!token) return;
    try {
      await this.prisma.expiredJwt.create({
        data: {
          token,
        },
      });

      res.clearCookie(this.config.get('TOKEN_NAME', 'aryan.sid'), {
        path: '/',
      });

      return;
    } catch (err) {
      if (err.code === 'P2002') {
        // token already exists
        return;
      }
      throw new InternalServerErrorException(err.message);
    }
  }

  async session(token: string, res: Response) {
    if (!token) {
      res.clearCookie(this.config.get('TOKEN_NAME', 'aryan.sid'), {
        path: '/',
      });
      return { authenticated: false };
    }
    try {
      await this.jwt.verifyAsync(token);
      return { authenticated: true };
    } catch (err) {
      res.clearCookie(this.config.get('TOKEN_NAME', 'aryan.sid'), {
        path: '/',
      });
      return { authenticated: false };
    }
  }
}
