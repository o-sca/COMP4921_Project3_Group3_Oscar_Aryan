import { FRIEND_INVITATION_STATUS, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany({});

  await prisma.user.upsert({
    where: { email: 'patrick@mail.com' },
    update: {},
    create: {
      email: 'patrick@mail.com',
      first_name: 'Patrick',
      last_name: 'Guichon',
      password: '$2a$12$KfR9eNC9fxFBviwsjWffaOeuGNw3QJL6ubqg9KfP9gJw/JMMAMf8O',
      profile_pic_url:
        'https://res.cloudinary.com/dj6rvkhvo/image/upload/v1697499455/avatars/1/h1hhribuj7xiffrndplr.jpg',
    },
  });

  await prisma.user.upsert({
    where: { email: 'oscar@mail.com' },
    update: {},
    create: {
      email: 'oscar@mail.com',
      first_name: 'Oscar',
      last_name: 'Zhu',
      password: '$2a$12$KfR9eNC9fxFBviwsjWffaOeuGNw3QJL6ubqg9KfP9gJw/JMMAMf8O',
      profile_pic_url:
        'https://res.cloudinary.com/dj6rvkhvo/image/upload/v1697499467/avatars/2/zeutw7y3ycd4h7c8a8eu.jpg',
    },
  });

  await prisma.user.upsert({
    where: { email: 'aryan@mail.com' },
    update: {},

    create: {
      email: 'aryan@mail.com',
      first_name: 'Aryan',
      last_name: 'Jand',
      password: '$2a$12$KfR9eNC9fxFBviwsjWffaOeuGNw3QJL6ubqg9KfP9gJw/JMMAMf8O',
      profile_pic_url:
        'https://res.cloudinary.com/dj6rvkhvo/image/upload/v1697499479/avatars/3/l3xnzzi2hqww2ulfiblq.jpg',
    },
  });

  await prisma.user.createMany({
    data: [
      {
        email: 'carmen@mail.com',
        first_name: 'Carmen',
        last_name: 'Berzatto',
        password:
          '$2a$12$.Bgf65iUQLngvowMdhMC.eURFSJhPCBcjXkfHb79OBTqzF/lAtvvS',
        profile_pic_url:
          'https://res.cloudinary.com/dj6rvkhvo/image/upload/v1697499455/avatars/1/h1hhribuj7xiffrndplr.jpg',
      },
      {
        email: 'mikey@mail.com',
        first_name: 'Mikey',
        last_name: 'Berzatto',
        password:
          '$2a$12$.Bgf65iUQLngvowMdhMC.eURFSJhPCBcjXkfHb79OBTqzF/lAtvvS',
        profile_pic_url:
          'https://res.cloudinary.com/dj6rvkhvo/image/upload/v1697499455/avatars/1/h1hhribuj7xiffrndplr.jpg',
      },
      {
        email: 'richard@mail.com',
        first_name: 'Richard',
        last_name: 'Jerimovic',
        password:
          '$2a$12$.Bgf65iUQLngvowMdhMC.eURFSJhPCBcjXkfHb79OBTqzF/lAtvvS',
        profile_pic_url:
          'https://res.cloudinary.com/dj6rvkhvo/image/upload/v1697499455/avatars/1/h1hhribuj7xiffrndplr.jpg',
      },
      {
        email: 'ayo@mail.com',
        first_name: 'Ayo',
        last_name: 'Edebiri',
        password:
          '$2a$12$.Bgf65iUQLngvowMdhMC.eURFSJhPCBcjXkfHb79OBTqzF/lAtvvS',
        profile_pic_url:
          'https://res.cloudinary.com/dj6rvkhvo/image/upload/v1697499455/avatars/1/h1hhribuj7xiffrndplr.jpg',
      },
      {
        email: 'jim@mail.com',
        first_name: 'Jim',
        last_name: 'Halpert',
        password:
          '$2a$12$.Bgf65iUQLngvowMdhMC.eURFSJhPCBcjXkfHb79OBTqzF/lAtvvS',
        profile_pic_url:
          'https://res.cloudinary.com/dj6rvkhvo/image/upload/v1697499455/avatars/1/h1hhribuj7xiffrndplr.jpg',
      },
      {
        email: 'dwight@mail.com',
        first_name: 'Dwight',
        last_name: 'Shrute',
        password:
          '$2a$12$.Bgf65iUQLngvowMdhMC.eURFSJhPCBcjXkfHb79OBTqzF/lAtvvS',
        profile_pic_url:
          'https://res.cloudinary.com/dj6rvkhvo/image/upload/v1697499455/avatars/1/h1hhribuj7xiffrndplr.jpg',
      },
      {
        email: 'andy@mail.com',
        first_name: 'Andy',
        last_name: 'Bernard',
        password:
          '$2a$12$.Bgf65iUQLngvowMdhMC.eURFSJhPCBcjXkfHb79OBTqzF/lAtvvS',
        profile_pic_url:
          'https://res.cloudinary.com/dj6rvkhvo/image/upload/v1697499455/avatars/1/h1hhribuj7xiffrndplr.jpg',
      },
      {
        email: 'neil@mail.com',
        first_name: 'Neil',
        last_name: 'Faks',
        password:
          '$2a$12$.Bgf65iUQLngvowMdhMC.eURFSJhPCBcjXkfHb79OBTqzF/lAtvvS',
        profile_pic_url:
          'https://res.cloudinary.com/dj6rvkhvo/image/upload/v1697499455/avatars/1/h1hhribuj7xiffrndplr.jpg',
      },
    ],
  });

  await prisma.friend.createMany({
    data: [
      {
        receiver_id: 1,
        sender_id: 2,
        invitation_status: FRIEND_INVITATION_STATUS.ACCEPTED,
      },
      {
        receiver_id: 1,
        sender_id: 3,
        invitation_status: FRIEND_INVITATION_STATUS.ACCEPTED,
      },
      {
        receiver_id: 1,
        sender_id: 4,
        invitation_status: FRIEND_INVITATION_STATUS.ACCEPTED,
      },
      {
        receiver_id: 1,
        sender_id: 5,
        invitation_status: FRIEND_INVITATION_STATUS.ACCEPTED,
      },
      {
        receiver_id: 1,
        sender_id: 6,
        invitation_status: FRIEND_INVITATION_STATUS.ACCEPTED,
      },
      {
        receiver_id: 1,
        sender_id: 7,
        invitation_status: FRIEND_INVITATION_STATUS.ACCEPTED,
      },
      {
        receiver_id: 2,
        sender_id: 3,
        invitation_status: FRIEND_INVITATION_STATUS.ACCEPTED,
      },
      {
        receiver_id: 2,
        sender_id: 4,
        invitation_status: FRIEND_INVITATION_STATUS.ACCEPTED,
      },
      {
        receiver_id: 2,
        sender_id: 5,
        invitation_status: FRIEND_INVITATION_STATUS.ACCEPTED,
      },
      {
        receiver_id: 2,
        sender_id: 6,
        invitation_status: FRIEND_INVITATION_STATUS.ACCEPTED,
      },
      {
        receiver_id: 2,
        sender_id: 11,
        invitation_status: FRIEND_INVITATION_STATUS.ACCEPTED,
      },
      {
        receiver_id: 2,
        sender_id: 7,
        invitation_status: FRIEND_INVITATION_STATUS.ACCEPTED,
      },
      {
        receiver_id: 3,
        sender_id: 4,
        invitation_status: FRIEND_INVITATION_STATUS.ACCEPTED,
      },
      {
        receiver_id: 3,
        sender_id: 5,
        invitation_status: FRIEND_INVITATION_STATUS.ACCEPTED,
      },
      {
        receiver_id: 3,
        sender_id: 6,
        invitation_status: FRIEND_INVITATION_STATUS.ACCEPTED,
      },
      {
        receiver_id: 3,
        sender_id: 11,
        invitation_status: FRIEND_INVITATION_STATUS.ACCEPTED,
      },
      {
        receiver_id: 3,
        sender_id: 7,
        invitation_status: FRIEND_INVITATION_STATUS.ACCEPTED,
      },
      {
        receiver_id: 8,
        sender_id: 9,
        invitation_status: FRIEND_INVITATION_STATUS.ACCEPTED,
      },
      {
        receiver_id: 8,
        sender_id: 10,
        invitation_status: FRIEND_INVITATION_STATUS.ACCEPTED,
      },
      {
        receiver_id: 8,
        sender_id: 11,
        invitation_status: FRIEND_INVITATION_STATUS.ACCEPTED,
      },
      {
        receiver_id: 8,
        sender_id: 6,
        invitation_status: FRIEND_INVITATION_STATUS.ACCEPTED,
      },
      {
        receiver_id: 8,
        sender_id: 7,
        invitation_status: FRIEND_INVITATION_STATUS.ACCEPTED,
      },
    ],
  });
}

main()
  .then(() => {
    console.log('seeded');
  })
  .catch(async (e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
