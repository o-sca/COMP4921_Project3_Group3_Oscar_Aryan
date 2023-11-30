import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, ReqUser } from 'src/common';
import { FriendService } from './friend.service';

@UseGuards(AuthGuard)
@Controller('friends')
export class FriendController {
  constructor(private friend: FriendService) {}

  @HttpCode(HttpStatus.OK)
  @Get('search')
  search(@Query('name') name: string) {
    return this.friend.search(name);
  }

  @HttpCode(HttpStatus.OK)
  @Get('suggest')
  getSuggestions(@ReqUser('id') userId: number) {
    return this.friend.getSuggestions(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  getAll(@ReqUser('id') userId: number) {
    return this.friend.getAll(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.friend.getOne(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('add')
  addOne(
    @ReqUser('id') userId: number,
    @Query('id', ParseIntPipe) receiverId: number,
  ) {
    return this.friend.addOne(userId, receiverId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('accept')
  acceptOne(@Query('id', ParseIntPipe) friendRequestId: number) {
    return this.friend.acceptOne(friendRequestId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('remove')
  removeOne(
    @ReqUser('id') userId: number,
    @Query('id', ParseIntPipe) friendId: number,
  ) {
    return this.friend.removeOne(userId, friendId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('reject')
  rejectOne(@Query('id', ParseIntPipe) friendRequestId: number) {
    return this.friend.rejectOne(friendRequestId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('cancel')
  cancelOne(@Query('id', ParseIntPipe) friendRequestId: number) {
    return this.friend.cancelOne(friendRequestId);
  }
}
