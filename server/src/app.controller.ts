import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Root')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({
    summary: 'Root endpoint',
    description: 'Show the home page or Login / Sing-up Page',
  })
  root() {
    return;
  }
}
