import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany({});

  await prisma.user.upsert({
    where: { email: 'dummy@mail.com' },
    update: {},
    create: {
      email: 'dummy@mail.com',
      first_name: 'Dummy',
      last_name: 'User',
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
        email: 'dummy2@mail.com',
        first_name: 'Carmen',
        last_name: 'Berzatto',
        password:
          '$2a$12$.Bgf65iUQLngvowMdhMC.eURFSJhPCBcjXkfHb79OBTqzF/lAtvvS',
        profile_pic_url:
          'https://res.cloudinary.com/dj6rvkhvo/image/upload/v1697499455/avatars/1/h1hhribuj7xiffrndplr.jpg',
      },
      {
        email: 'dummy3@mail.com',
        first_name: 'Mikey',
        last_name: 'Berzatto',
        password:
          '$2a$12$.Bgf65iUQLngvowMdhMC.eURFSJhPCBcjXkfHb79OBTqzF/lAtvvS',
        profile_pic_url:
          'https://res.cloudinary.com/dj6rvkhvo/image/upload/v1697499455/avatars/1/h1hhribuj7xiffrndplr.jpg',
      },
      {
        email: 'dummy4@mail.com',
        first_name: 'Richard',
        last_name: 'Jerimovic',
        password:
          '$2a$12$.Bgf65iUQLngvowMdhMC.eURFSJhPCBcjXkfHb79OBTqzF/lAtvvS',
        profile_pic_url:
          'https://res.cloudinary.com/dj6rvkhvo/image/upload/v1697499455/avatars/1/h1hhribuj7xiffrndplr.jpg',
      },
      {
        email: 'dummy5@mail.com',
        first_name: 'Ayo',
        last_name: 'Edebiri',
        password:
          '$2a$12$.Bgf65iUQLngvowMdhMC.eURFSJhPCBcjXkfHb79OBTqzF/lAtvvS',
        profile_pic_url:
          'https://res.cloudinary.com/dj6rvkhvo/image/upload/v1697499455/avatars/1/h1hhribuj7xiffrndplr.jpg',
      },
      {
        email: 'dummy6@mail.com',
        first_name: 'Jim',
        last_name: 'Halpert',
        password:
          '$2a$12$.Bgf65iUQLngvowMdhMC.eURFSJhPCBcjXkfHb79OBTqzF/lAtvvS',
        profile_pic_url:
          'https://res.cloudinary.com/dj6rvkhvo/image/upload/v1697499455/avatars/1/h1hhribuj7xiffrndplr.jpg',
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
