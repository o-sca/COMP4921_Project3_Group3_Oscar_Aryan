import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { EVENT_INVITATION_STATUS } from '@prisma/client';

@Injectable()
export class InvitationStatusPipe implements PipeTransform {
  transform(value: string) {
    const invitationStatus = value;
    if (!invitationStatus) {
      throw new BadRequestException('Invitation status is required');
    }
    const status = invitationStatus.toUpperCase();
    if (
      ![...Object.values(EVENT_INVITATION_STATUS)].includes(
        status as EVENT_INVITATION_STATUS,
      )
    ) {
      throw new BadRequestException(
        'Invitation status must be either ACCEPTED or DECLINED',
      );
    }
    return status as EVENT_INVITATION_STATUS;
  }
}
