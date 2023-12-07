import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { PrismaErrorHandler } from 'src/common';
import { ConfigService } from '@nestjs/config';
import { EVENT_INVITATION_STATUS } from '@prisma/client';
import { Event } from '@prisma/client';
import { GET_DELETED_EVENTS } from './event.raw-query';

@Injectable()
export class EventService {
  errorHandler: PrismaErrorHandler;

  constructor(private prisma: PrismaService, private config: ConfigService) {
    const isProduction = this.config.get('NODE_ENV') === 'production';
    this.errorHandler = new PrismaErrorHandler(isProduction);
  }

  async getAllDeleted(userId: number) {
    try {
      const events = await this.prisma.$queryRaw<
        Event & { days_left: number }[]
      >(GET_DELETED_EVENTS(userId));
      return events;
    } catch (err) {
      console.log(err);
      return this.errorHandler.handle(err);
    }
  }

  async getAll(userId: number) {
    try {
      const events = await this.prisma.event.findMany({
        where: {
          OR: [
            {
              event_owner_id: userId,
              deleted: false,
            },
            {
              deleted: false,
              Event_Attendance: {
                some: {
                  user_attende_id: userId,
                  response_type: { not: EVENT_INVITATION_STATUS.DECLINED },
                },
              },
            },
          ],
        },
        include: {
          Event_Attendance: true,
        },
      });
      return events;
    } catch (err) {
      console.log(err);
      return this.errorHandler.handle(err);
    }
  }

  async getOne(userId: number, eventId: number) {
    try {
      const event = await this.prisma.event.findFirst({
        where: {
          id: eventId,
        },
        include: {
          Event_Attendance: {
            include: {
              user_attende: {
                select: {
                  id: true,
                  first_name: true,
                  last_name: true,
                },
              },
            },
          },
          event_owner: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
            },
          },
        },
      });
      if (event.deleted) {
        return;
      }
      return { userId, ...event };
    } catch (err) {
      console.log(err);
      return this.errorHandler.handle(err);
    }
  }

  async delete(userId: number, eventId: number) {
    try {
      await this.prisma.event.update({
        where: {
          id: eventId,
          event_owner_id: userId,
        },
        data: {
          deleted: true,
        },
      });
      return;
    } catch (err) {
      console.log(err);
      return this.errorHandler.handle(err);
    }
  }

  async restore(userId: number, eventId: number, deleted: boolean) {
    try {
      await this.prisma.event.update({
        where: {
          id: eventId,
          event_owner_id: userId,
        },
        data: {
          deleted: deleted,
        },
      });
      return;
    } catch (err) {
      console.log(err);
      return this.errorHandler.handle(err);
    }
  }

  async create(userId: number, dto: CreateEventDto) {
    try {
      const result = await this.prisma.event.create({
        data: {
          event_owner_id: userId,
          color: dto.color,
          all_day: dto.allDay,
          daysOfWeek: dto.daysOfWeek.toString(),
          title: dto.eventTitle,
          start_date_time: dto.startDate,
          end_date_time: dto.endDate,
          Event_Attendance: {
            createMany: {
              data: dto.friends.map((friend) => {
                return {
                  user_attende_id: friend.friend_id,
                  response_type: EVENT_INVITATION_STATUS.PENDING,
                };
              }),
            },
          },
        },
      });
      return result;
    } catch (err) {
      console.log(err);
      return this.errorHandler.handle(err);
    }
  }

  async updateAttendeeStatus(
    userId: number,
    eventId: number,
    invitationStatus: EVENT_INVITATION_STATUS,
  ) {
    try {
      const result = await this.prisma.event.update({
        where: {
          id: eventId,
          event_owner_id: { not: userId },
        },
        data: {
          Event_Attendance: {
            updateMany: {
              data: {
                response_type: invitationStatus,
              },
              where: {
                event_id: eventId,
                user_attende_id: userId,
              },
            },
          },
        },
      });
      return result;
    } catch (err) {
      console.log(err);
      return this.errorHandler.handle(err);
    }
  }
}
