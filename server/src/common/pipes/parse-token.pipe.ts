import { Injectable, PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ParseTokenPipe implements PipeTransform {
  constructor(private config: ConfigService) {}

  transform(value: unknown) {
    const tokenName = this.config.get<string>('TOKEN_NAME', 'aryan.sid');
    return value[tokenName] ?? value;
  }
}
