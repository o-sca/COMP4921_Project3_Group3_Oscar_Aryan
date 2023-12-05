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
} from '@nestjs/common';
import { ReqUser } from 'src/common';
import { FriendService } from './friend.service';

@Controller('friends')
export class FriendController {
  constructor(private friend: FriendService) {}

  @HttpCode(HttpStatus.OK)
  @Get('find')
  find(@ReqUser('id') userId: number, @Query('name') name: string) {
    return this.friend.find(name, userId);
  }

  @HttpCode(HttpStatus.OK)
  @Get('search')
  search(@ReqUser('id') userId: number, @Query('name') name: string) {
    return this.friend.search(name, userId);
  }

  @HttpCode(HttpStatus.OK)
  @Get('suggest')
  getSuggestions(@ReqUser('id') userId: number) {
    return this.friend.getSuggestions(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  getFriendsByProfile(
    @ReqUser('id') userId: number,
    @Query('id') profileId: number,
  ) {
    return this.friend.getAllFromProfile(userId, profileId);
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
