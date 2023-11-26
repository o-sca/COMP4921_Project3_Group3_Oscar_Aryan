import { Injectable } from '@nestjs/common';
import { FRIEND_INVITATION_STATUS } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) {}

  async getAll(userId: number) {
    try {
      const friends = await this.prisma.friend.findMany({
        where: {
          OR: [
            {
              sender_id: userId,
            },
            {
              receiver_id: userId,
            },
          ],
        },
        include: {
          receiver: {
            select: {
              first_name: true,
              last_name: true,
              profile_pic_url: true,
            },
          },
        },
      });
      console.log(friends);
      return friends;
    } catch (err) {
      console.error(err);
      return;
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
      console.error(err);
      return;
    }
  }

  async addOne(userId: number, receiverId: number) {
    try {
      await this.prisma.friend.create({
        data: {
          sender_id: userId,
          receiver_id: receiverId,
          invitation_status: FRIEND_INVITATION_STATUS.PENDING,
        },
      });
    } catch (err) {
      console.error(err);
      return;
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
      console.error(err);
      return;
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
      console.error(err);
      return;
    }
  }
}
