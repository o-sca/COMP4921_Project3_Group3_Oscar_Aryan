import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, ReqUser } from 'src/common';
import { FriendService } from './friend.service';

@UseGuards(AuthGuard)
@Controller('friends')
export class FriendController {
  constructor(private friend: FriendService) {}

  @Get()
  getAll(@ReqUser('id') userId: number) {
    return this.friend.getAll(userId);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.friend.getOne(id);
  }

  @Post('add')
  addOne(
    @ReqUser('id') userId: number,
    @Query('id', ParseIntPipe) receiverId: number,
  ) {
    return this.friend.addOne(userId, receiverId);
  }

  @Put('accept')
  acceptOne(@Query('id', ParseIntPipe) friendRequestId: number) {
    return this.friend.acceptOne(friendRequestId);
  }

  @Put('reject')
  rejectOne(@Query('id', ParseIntPipe) friendRequestId: number) {
    return this.friend.rejectOne(friendRequestId);
  }
}
