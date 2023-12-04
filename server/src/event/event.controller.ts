import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EVENT_INVITATION_STATUS } from '@prisma/client';
import { ReqUser } from 'src/common';
import { InvitationStatusPipe } from 'src/common/pipes';
import { CreateEventDto } from './dto/create-event.dto';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private eventService: EventService) {}

  @Post('create')
  create(@ReqUser('id') userId: number, @Body() dto: CreateEventDto) {
    return this.eventService.create(userId, dto);
  }

  @Get('deleted')
  getAllDeleted(@ReqUser('id') userId: number) {
    return this.eventService.getAllDeleted(userId);
  }

  @Get(':id')
  getOne(
    @ReqUser('id') userId: number,
    @Param('id', ParseIntPipe) eventId: number,
  ) {
    return this.eventService.getOne(userId, eventId);
  }

  @Get()
  getAll(@ReqUser('id') userId: number) {
    return this.eventService.getAll(userId);
  }

  @Delete()
  delete(
    @ReqUser('id') userId: number,
    @Query('id', ParseIntPipe) eventId: number,
  ) {
    return this.eventService.delete(userId, eventId);
  }

  @Patch()
  restore(
    @ReqUser('id') userId: number,
    @Query('id', ParseIntPipe) eventId: number,
    @Body('deleted', ParseBoolPipe) deleted: boolean,
  ) {
    return this.eventService.restore(userId, eventId, deleted);
  }

  @Patch(':id')
  update(
    @ReqUser('id') userId: number,
    @Param('id', ParseIntPipe) eventId: number,
    @Body('invitationStatus', InvitationStatusPipe)
    invitationStatus: EVENT_INVITATION_STATUS,
  ) {
    return this.eventService.updateAttendeeStatus(
      userId,
      eventId,
      invitationStatus,
    );
  }
}
