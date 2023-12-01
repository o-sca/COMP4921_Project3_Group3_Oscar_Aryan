import { FRIEND_INVITATION_STATUS, Prisma } from '@prisma/client';

export const GET_SUGGESTIONS = (userId: number) => {
  return Prisma.sql`
      SELECT 
        u.id, 
        CONCAT(u.first_name, " ", u.last_name) as name, 
        u.email, 
        u.profile_pic_url
      FROM User u
      JOIN Friend f
      ON u.id = f.receiver_id
      WHERE u.id != ${userId}
      AND NOT u.id IN (SELECT f.receiver_id FROM Friend f WHERE f.sender_id = ${userId})
      AND u.id NOT IN
        (
          SELECT
            u.id
          FROM User u
          JOIN Friend f
          ON u.id = f.receiver_id
          WHERE f.sender_id = ${userId}
          AND NOT f.invitation_status = "REJECTED"
          UNION
          SELECT
            u.id
          FROM User u
          JOIN Friend f
          ON u.id = f.sender_id
          WHERE f.receiver_id = ${userId}
          AND NOT f.invitation_status = "REJECTED"
      )
      GROUP BY u.id
      ORDER BY COUNT(f.receiver_id) DESC
      LIMIT 5
      `;
};

export type GetSuggestions = {
  id: number;
  email: string;
  name: string;
  profile_pic_url: string;
};

export const GET_ALL_FRIENDS = (userId: number) => {
  return Prisma.sql`
        SELECT
          f.id as friend_request_id,
          u.id as friend_id,
          u.first_name,
          u.last_name,
          u.email,
          u.profile_pic_url,
          f.invitation_status,
          f.receiver_id,
          f.sender_id
        FROM User u
        JOIN Friend f
        ON u.id = f.receiver_id
        WHERE f.sender_id = ${userId}
        AND NOT f.invitation_status = ${FRIEND_INVITATION_STATUS.REJECTED}
        UNION
        SELECT
          f.id as friend_request_id,
          u.id as friend_id,
          u.first_name,
          u.last_name,
          u.email,
          u.profile_pic_url,
          f.invitation_status,
          f.receiver_id,
          f.sender_id
        FROM User u
        JOIN Friend f
        ON u.id = f.sender_id
        WHERE f.receiver_id = ${userId}
        AND NOT f.invitation_status = ${FRIEND_INVITATION_STATUS.REJECTED}
      `;
};
