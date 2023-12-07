import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FRIEND_INVITATION_STATUS, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaErrorHandler } from '../common/prisma-error.handler';
import {
  GetSuggestions,
  GET_ALL_FRIENDS,
  GET_ALL_FRIENDS_FROM_PROFILE,
  GET_SUGGESTIONS,
  QUERY_FRIENDS,
} from './friend.raw-query';

@Injectable()
export class FriendService {
  private readonly isProd: boolean;
  private errorHandler: PrismaErrorHandler;

  constructor(private prisma: PrismaService, private config: ConfigService) {
    this.isProd =
      this.config.get<string>('NODE_ENV', 'development') === 'production';
    this.errorHandler = new PrismaErrorHandler(this.isProd);
  }

  async getSuggestions(userId: number) {
    try {
      const suggestions = await this.prisma.$queryRaw<GetSuggestions>(
        GET_SUGGESTIONS(userId),
      );
      return suggestions;
    } catch (err) {
      console.log(err);
      return this.errorHandler.handle(err);
    }
  }

  async search(name: string, userId: number) {
    try {
      const results = await this.prisma.$queryRaw<GetSuggestions>(
        QUERY_FRIENDS(name, userId),
      );
      return results;
    } catch (err) {
      return this.errorHandler.handle(err);
    }
  }

  async find(name: string, userId: number) {
    try {
      const results = await this.prisma.user.findMany({
        where: {
          OR: [
            {
              first_name: { contains: name },
              id: { not: userId },
              friends_received: {
                none: { OR: [{ receiver_id: userId }, { sender_id: userId }] },
              },
              friend_sent: {
                none: { OR: [{ receiver_id: userId }, { sender_id: userId }] },
              },
            },
            {
              last_name: { contains: name },
              id: { not: userId },
              friends_received: {
                none: { OR: [{ receiver_id: userId }, { sender_id: userId }] },
              },
              friend_sent: {
                none: { OR: [{ receiver_id: userId }, { sender_id: userId }] },
              },
            },
          ],
        },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          profile_pic_url: true,
        },
      });
      return results;
    } catch (err) {
      return this.errorHandler.handle(err);
    }
  }

  async getAll(userId: number) {
    try {
      const friends = await this.prisma.$queryRaw<
        Omit<
          User & {
            invitation_status: FRIEND_INVITATION_STATUS;
            friend_id: number;
            receiver_id: number;
            sender_id: number;
            friend_request_id: number;
          },
          'password' | 'created_at' | 'updated_at'
        >[]
      >(GET_ALL_FRIENDS(userId));
      return friends;
    } catch (err) {
      return this.errorHandler.handle(err);
    }
  }

  async getAllFromProfile(userId: number, profileId: number) {
    try {
      const friends = await this.prisma.$queryRaw<
        Omit<
          User & {
            friend_id: number;
          },
          'password' | 'created_at' | 'updated_at'
        >[]
      >(GET_ALL_FRIENDS_FROM_PROFILE(userId, profileId));
      return friends;
    } catch (err) {
      return this.errorHandler.handle(err);
    }
  }

  async getOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          first_name: true,
          last_name: true,
          email: true,
          profile_pic_url: true,
        },
      });
      return user;
    } catch (err) {
      return this.errorHandler.handle(err);
    }
  }

  async addOne(userId: number, receiverId: number) {
    try {
      const requestExists = await this.prisma.friend.findFirst({
        where: {
          OR: [
            { sender_id: userId, receiver_id: receiverId },
            { sender_id: receiverId, receiver_id: userId },
          ],
        },
      });
      if (requestExists) {
        return;
      }
      await this.prisma.friend.create({
        data: {
          sender_id: userId,
          receiver_id: receiverId,
          invitation_status: FRIEND_INVITATION_STATUS.PENDING,
        },
      });
    } catch (err) {
      return this.errorHandler.handle(err);
    }
  }

  async acceptOne(friendRequestId: number) {
    try {
      await this.prisma.friend.update({
        where: {
          id: friendRequestId,
        },
        data: { invitation_status: FRIEND_INVITATION_STATUS.ACCEPTED },
      });
      return;
    } catch (err) {
      return this.errorHandler.handle(err);
    }
  }

  async removeOne(userId: number, friendId: number) {
    try {
      await this.prisma.friend.deleteMany({
        where: {
          OR: [
            { sender_id: userId, receiver_id: friendId },
            { sender_id: friendId, receiver_id: userId },
          ],
        },
      });
      return;
    } catch (err) {
      return this.errorHandler.handle(err);
    }
  }

  async rejectOne(friendRequestId: number) {
    try {
      await this.prisma.friend.update({
        where: {
          id: friendRequestId,
        },
        data: { invitation_status: FRIEND_INVITATION_STATUS.REJECTED },
      });
      return;
    } catch (err) {
      return this.errorHandler.handle(err);
    }
  }

  async cancelOne(friendRequestId: number) {
    try {
      await this.prisma.friend.delete({
        where: { id: friendRequestId },
      });
      return;
    } catch (err) {
      return this.errorHandler.handle(err);
    }
  }
}
