import { Prisma } from '@prisma/client';

export const GET_DELETED_EVENTS = (userId: number) => {
  return Prisma.sql`
    SELECT 
      *, 
      CONVERT((30 - DATEDIFF(NOW(), updated_at)), DECIMAL) as days_left 
    FROM Event 
    WHERE event_owner_id = ${userId} 
    AND deleted = 1 
  `;
};
