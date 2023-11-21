import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'dummyuser',
    required: true
 })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Password123!',
    required: true
 })
  password: string;
}
