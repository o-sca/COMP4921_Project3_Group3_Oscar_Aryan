import { OmitType, PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUrl,
} from 'class-validator';
import { SignInDto } from './signin.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto extends PartialType(
  OmitType(SignInDto, ['password'] as const),
) {

  @IsString()
  @ApiProperty({
    example: 'John',
    required: true
 })
  firstName: string;

  @IsString()
  @ApiProperty({
    example: 'Smith',
    required: true
  })
  lastName: string;
  
  @IsString()
  @IsEmail()
  @ApiProperty({
    example: 'user@mail.com',
    required: true
  })
  email: string;
  
  @IsStrongPassword({ minLength: 10, minSymbols: 1, minUppercase: 1 })
  @ApiProperty({
    example: 'Password123!',
    required: true
 })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Password123!',
    required: true
 })
  confirmPassword: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty({
    example: 'String URL to CDN that stores user profile picture',
    required: true
 })
  profilePicture: string;
}
